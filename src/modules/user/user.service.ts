import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ResponseDTO } from '../../common';
import { BackendsOrchestratorService } from '../backends-orchestrator/backends_orchestrator.service';

@Injectable()
export class UserService {
  constructor(
    private readonly backends_orchestrator_service: BackendsOrchestratorService,
  ) {}

  async validate_master_password(req: Request): Promise<ResponseDTO> {
    return this.backends_orchestrator_service.redirect_request(req);
  }
}
