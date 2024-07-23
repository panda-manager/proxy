import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { AzureBackendService } from './backends/azure-backend/azure_backend.service';
import { GCPBackendService } from './backends/gcp-backend/gcp_backend.service';
import { Request } from 'express';
import { BaseBackendService } from './backends/base_backend.service';
import { RedisService, TRedisDocument } from '../../config/redis/redis.service';
import { EBackend, HttpMethod, PAIR_UUID_HEADER } from '../../common';
import { AxiosRequestConfig } from 'axios';
import { RevertsService } from './backends/reverts/reverts.service';

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
    const pair_redis_key = req.headers[PAIR_UUID_HEADER] as string;
    const found = await this.redis_service.get_key(pair_redis_key);

    if (!found && !backend)
      backend = Math.random() < 0.5 ? EBackend.AZURE : EBackend.GCP;
    else if (found)
      backend =
        found.backend === EBackend.AZURE ? EBackend.GCP : EBackend.AZURE;

    const handler: BaseBackendService = this.conclude_handler(backend);
    const info: TRedisDocument = {
      backend,
      uri: req.url,
      method: req.method as HttpMethod,
      params: req.params,
      body: req.body,
      headers: req.headers,
    };

    this.logger.log(
      `Redirecting ${req.method} ${req.url} to ${EBackend[handler.which()]}`,
    );

    try {
      const res = handler.redirect_request(req);

      if (!found) await this.redis_service.insert_key(pair_redis_key, info);
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

  make_request(config: AxiosRequestConfig, backend: EBackend): Promise<any> {
    switch (backend) {
      case EBackend.AZURE:
        return this.request_azure(config);
      case EBackend.GCP:
        return this.request_gcp(config);
    }
  }
}
