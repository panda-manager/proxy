import { Injectable, Logger } from '@nestjs/common';
import { BackendReg1Service } from './backends/backend-reg-1/backend_reg_1.service';
import { BackendReg2Service } from './backends/backend-reg-2/backend_reg_2.service';
import { Request } from 'express';
import { BaseBackendService } from './backends/base_backend.service';
import { RedisService } from '../../config/redis/redis.service';

export type RegionNumber = number;
@Injectable()
export class BackendsOrchestratorService {
  private readonly reg_amount: number = 2;
  private readonly logger = new Logger(BackendsOrchestratorService.name);
  constructor(
    private readonly backend_reg_1_service: BackendReg1Service,
    private readonly backend_reg_2_service: BackendReg2Service,
    private readonly redis_service: RedisService,
  ) {
    redis_service.connect().then(() => this.logger.log('Redis connected!'));
  }

  conclude_handler(reg: RegionNumber): BaseBackendService {
    switch (reg) {
      case 1:
        return this.backend_reg_1_service;
      case 2:
        return this.backend_reg_2_service;
    }
  }

  async redirect_request(req: Request, reg: RegionNumber) {
    const pair_redis_key = req.headers['X-PAIR-REDIS-KEY'] as string;
    const found = await this.redis_service.get_key(pair_redis_key);

    if (!found && (!reg || reg < 1 || reg > this.reg_amount))
      reg = Math.random() < 0.5 ? 1 : 2;
    else if (found) reg = found.reg == 1 ? 2 : 1;

    const res = this.conclude_handler(reg).redirect_request(req);

    if (!found)
      await this.redis_service.insert_key(pair_redis_key, {
        reg,
      });
    else await this.redis_service.delete_key(pair_redis_key);
    return res;
  }
}
