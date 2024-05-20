import { Injectable, Logger, NotImplementedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../../auth/auth.service';
import { AppDisplayedCredentialsDTO } from './dto/app_displayed_credentials';
import { ResponseDTO } from '../../common';
import { BackendsOrchestratorService } from '../backends-orchestrator/backends_orchestrator.service';

@Injectable()
export class CredentialsService {
  private readonly logger = new Logger(CredentialsService.name);

  constructor(
    private readonly auth_service: AuthService,
    private readonly backends_orchestrator_service: BackendsOrchestratorService,
  ) {}

  async insert(req: Request): Promise<ResponseDTO> {
    throw new NotImplementedException();
  }

  async update(req: Request): Promise<ResponseDTO> {
    throw new NotImplementedException();
  }

  async get_app_displayed_credentials(
    req: Request,
  ): Promise<AppDisplayedCredentialsDTO[]> {
    return this.backends_orchestrator_service.redirect_request(req);
  }

  async get_password(req: Request): Promise<string> {
    throw new NotImplementedException();
  }

  async remove(req: Request): Promise<ResponseDTO> {
    throw new NotImplementedException();
  }

  async has_any(req: Request): Promise<ResponseDTO> {
    throw new NotImplementedException();
  }
}
