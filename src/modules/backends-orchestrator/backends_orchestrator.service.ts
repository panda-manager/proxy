import { Injectable, Logger } from '@nestjs/common';
import { AzureBackendService } from './backends/azure-backend/azure_backend.service';
import { GCPBackendService } from './backends/gcp-backend/gcp_backend.service';
import { Request } from 'express';
import { BaseBackendService } from './backends/base_backend.service';
import { RedisService, TRedisDocument } from '../../config/redis/redis.service';
import { EBackend, PAIR_UUID_HEADER } from '../../common';

export type RegionNumber = number;
@Injectable()
export class BackendsOrchestratorService {
  private readonly logger = new Logger(BackendsOrchestratorService.name);
  constructor(
    private readonly azure_backend_service: AzureBackendService,
    private readonly gcp_backend_service: GCPBackendService,
    private readonly redis_service: RedisService,
  ) {}

  private conclude_handler(reg: RegionNumber): BaseBackendService {
    switch (reg) {
      case EBackend.AZURE:
        return this.azure_backend_service;
      case EBackend.GCP:
        return this.gcp_backend_service;
    }
  }

  async redirect_request(req: Request, reg?: EBackend): Promise<any> {
    const pair_redis_key = req.headers[PAIR_UUID_HEADER] as string;
    const found = await this.redis_service.get_key(pair_redis_key);

    if (!found && !reg) reg = Math.random() < 0.5 ? EBackend.AZURE : EBackend.GCP;
    else if (found)
      reg = found.reg == EBackend.AZURE ? EBackend.GCP : EBackend.AZURE;

    const handler: BaseBackendService = this.conclude_handler(reg);

    this.logger.log(
      `Redirecting ${req.method} ${req.url} to ${EBackend[handler.which()]}`,
    );
    const res = handler.redirect_request(req);

    if (!found)
      await this.redis_service.insert_key(pair_redis_key, {
        reg,
        uri: req.url,
        method: req.method,
        params: req.params,
        body: req.body,
      } as TRedisDocument);
    else await this.redis_service.delete_key(pair_redis_key);
    return res;
  }
}
