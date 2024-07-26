import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { AzureBackendService } from './backends/azure-backend/azure_backend.service';
import { GCPBackendService } from './backends/gcp-backend/gcp_backend.service';
import { BaseBackendService } from './backends/base_backend.service';
import { RedisService } from '../../config/redis/redis.service';
import { EBackend, PAIR_UUID_HEADER } from '../../common';
import { AxiosRequestConfig } from 'axios';
import { RevertsService } from './backends/reverts/reverts.service';
import { Request } from 'express';
import { RevertSchema, RevertTTL } from '../../config/redis/dto/revert.dto';

@Injectable()
export class BackendsOrchestratorService {
  private readonly logger = new Logger(BackendsOrchestratorService.name);
  constructor(
    private readonly azureBackendService: AzureBackendService,
    private readonly gcpBackendService: GCPBackendService,
    @Inject(forwardRef(() => RevertsService))
    private readonly revertsService: RevertsService,
    private readonly redisService: RedisService,
  ) {}

  private concludeHandler(backend: EBackend): BaseBackendService {
    switch (backend) {
      case EBackend.AZURE:
        return this.azureBackendService;
      case EBackend.GCP:
        return this.gcpBackendService;
    }
  }

  async redirectRequest(req: Request, backend?: EBackend): Promise<any> {
    const { method, headers, url, body, params } = req;

    const pairRedisKey = headers[PAIR_UUID_HEADER] as string;
    const found = !pairRedisKey
      ? null
      : await this.redisService.getKey(pairRedisKey);

    if (!found && !backend)
      backend = Math.random() < 0.5 ? EBackend.AZURE : EBackend.GCP;
    else if (found && !backend)
      backend =
        found.backend === EBackend.AZURE ? EBackend.GCP : EBackend.AZURE;

    const info = {
      backend,
      uri: url,
      method,
      params,
      body,
      headers: {
        authorization: headers.authorization,
      },
    } as RevertSchema;

    try {
      const handler: BaseBackendService = this.concludeHandler(backend);

      this.logger.log(
        `Redirecting ${method} ${url} to ${EBackend[handler.which()]}`,
      );

      const res = handler.redirectRequest(req);

      if (!found && pairRedisKey)
        await this.redisService.insertKey(pairRedisKey, info, RevertTTL);
      else if (pairRedisKey) await this.redisService.deleteKey(pairRedisKey);

      return res;
    } catch (e: unknown) {
      await this.revertsService.revert(info);
      throw e;
    }
  }

  private requestAzure(config: AxiosRequestConfig): Promise<any> {
    return this.azureBackendService.makeRequest(config);
  }

  private requestGCP(config: AxiosRequestConfig): Promise<any> {
    return this.gcpBackendService.makeRequest(config);
  }

  async makeRequest(
    config: AxiosRequestConfig,
    backend?: EBackend,
  ): Promise<any> {
    if (!backend) backend = Math.random() < 0.5 ? EBackend.AZURE : EBackend.GCP;

    switch (backend) {
      case EBackend.AZURE:
        return await this.requestAzure(config);
      case EBackend.GCP:
        return await this.requestGCP(config);
    }
  }
}
