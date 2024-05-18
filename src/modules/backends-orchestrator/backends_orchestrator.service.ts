import { Injectable } from '@nestjs/common';
import { BackendReg1Service } from './backends/backend-reg-1/backend_reg_1.service';
import { BackendReg2Service } from './backends/backend-reg-2/backend_reg_2.service';
import { Request } from 'express';
import { BaseBackendService } from './backends/base_backend.service';

export type RegionNumber = number;
@Injectable()
export class BackendsOrchestratorService {
  constructor(
    private readonly backend_reg_1_service: BackendReg1Service,
    private readonly backend_reg_2_service: BackendReg2Service,
  ) {}

  redirect_request(req: Request, reg?: RegionNumber) {
    let handler: BaseBackendService;

    if (!reg || (reg !== 1 && reg !== 2)) reg = Math.random() < 0.5 ? 1 : 2;

    switch (reg) {
      case 1:
        handler = this.backend_reg_1_service;
        break;
      case 2:
        handler = this.backend_reg_2_service;
        break;
    }

    return handler.redirect_request(req);
  }
}
