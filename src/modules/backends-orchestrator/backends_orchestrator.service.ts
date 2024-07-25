import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { AzureBackendService } from './backends/azure-backend/azure_backend.service';
import { GCPBackendService } from './backends/gcp-backend/gcp_backend.service';
import { BaseBackendService } from './backends/base_backend.service';
import { RedisService, TRedisDocument } from '../../config/redis/redis.service';
import { EBackend, PAIR_UUID_HEADER } from '../../common';
import { AxiosRequestConfig } from 'axios';
import { RevertsService } from './backends/reverts/reverts.service';
import { Request } from 'express';

@Injectable()
export class BackendsOrchestratorService {
  private readonly logger = new Logger(BackendsOrchestratorService.name);
  constructor(
    private readonly azure_backend_service: AzureBackendService,
    private readonly gcp_backend_service: GCPBackendService,
    @Inject(forwardRef(() => RevertsService))
    private readonly reverts_service: RevertsService,
    private readonly redis_service: RedisService,
  ) {}

  private conclude_handler(backend: EBackend): BaseBackendService {
    switch (backend) {
      case EBackend.AZURE:
        return this.azure_backend_service;
      case EBackend.GCP:
        return this.gcp_backend_service;
    }
  }

  async redirect_request(req: Request, backend?: EBackend): Promise<any> {
    const { method, headers, url, body, params } = req;

    const pair_redis_key = headers[PAIR_UUID_HEADER] as string;
    const found = await this.redis_service.get_key(pair_redis_key);

    if (!found && !backend)
      backend = Math.random() < 0.5 ? EBackend.AZURE : EBackend.GCP;
    else if (found)
      backend =
        found.backend === EBackend.AZURE ? EBackend.GCP : EBackend.AZURE;

    const info = {
      backend,
      uri: url,
      method,
      params,
      body,
      headers,
    } as TRedisDocument;

    try {
      const handler: BaseBackendService = this.conclude_handler(backend);

      this.logger.log(
        `Redirecting ${method} ${url} to ${EBackend[handler.which()]}`,
      );

      const res = handler.redirect_request(req);

      if (!found) await this.redis_service.insert_key(pair_redis_key, info, 60);
      else await this.redis_service.delete_key(pair_redis_key);

      return res;
    } catch (e: unknown) {
      await this.reverts_service.revert(info);
      throw e;
    }
  }

  private request_azure(config: AxiosRequestConfig): Promise<any> {
    return this.azure_backend_service.make_request(config);
  }

  private request_gcp(config: AxiosRequestConfig): Promise<any> {
    return this.gcp_backend_service.make_request(config);
  }

  async make_request(
    config: AxiosRequestConfig,
    backend?: EBackend,
  ): Promise<any> {
    if (!backend) backend = Math.random() < 0.5 ? EBackend.AZURE : EBackend.GCP;

    switch (backend) {
      case EBackend.AZURE:
        return await this.request_azure(config);
      case EBackend.GCP:
        return await this.request_gcp(config);
    }
  }
}
