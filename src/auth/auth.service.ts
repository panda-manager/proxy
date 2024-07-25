import { Injectable, Logger, NotImplementedException } from '@nestjs/common';
import { Request } from 'express';
import { ResponseDTO } from '../common';
import { AccessTokenResponseDTO } from './dto/access_token_response.dto';
import { BackendsOrchestratorService } from '../modules/backends-orchestrator/backends_orchestrator.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly backends_orchestrator: BackendsOrchestratorService,
  ) {}
  login(req: Request): Promise<AccessTokenResponseDTO> {
    return this.backends_orchestrator.redirect_request(req);
  }

  async register(req: Request): Promise<ResponseDTO> {
    throw new NotImplementedException();
  }

  async validate_master_password(req: Request): Promise<ResponseDTO> {
    return this.backends_orchestrator.redirect_request(req);
  }
}
