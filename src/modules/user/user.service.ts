import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ResponseDTO } from '../../common';
import { BackendsOrchestratorService } from '../backends-orchestrator/backends_orchestrator.service';

@Injectable()
export class UserService {
  constructor(
    private readonly backendsOrchestratorService: BackendsOrchestratorService,
  ) {}

  async validateMasterPassword(req: Request): Promise<ResponseDTO> {
    return this.backendsOrchestratorService.redirectRequest(req);
  }
}
