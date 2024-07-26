import { Injectable, NotImplementedException } from '@nestjs/common';
import { Request } from 'express';
import { ResponseDTO } from '../common';
import { AccessTokenResponseDTO } from './dto/access_token_response.dto';
import { BackendsOrchestratorService } from '../modules/backends-orchestrator/backends_orchestrator.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly backendsOrchestratorService: BackendsOrchestratorService,
  ) {}
  login(req: Request): Promise<AccessTokenResponseDTO> {
    return this.backendsOrchestratorService.redirectRequest(req);
  }

  async register(req: Request): Promise<ResponseDTO> {
    throw new NotImplementedException();
  }

  async validateMasterPassword(req: Request): Promise<ResponseDTO> {
    return this.backendsOrchestratorService.redirectRequest(req);
  }
}
