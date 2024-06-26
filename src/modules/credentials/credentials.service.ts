import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { CredentialsDTO } from './dto/credentials.dto';
import { ResponseDTO } from '../../common';
import { BackendsOrchestratorService } from '../backends-orchestrator/backends_orchestrator.service';

@Injectable()
export class CredentialsService {
  private readonly logger = new Logger(CredentialsService.name);

  constructor(
    private readonly backends_orchestrator_service: BackendsOrchestratorService,
  ) {}

  async insert(req: Request): Promise<ResponseDTO> {
    return this.backends_orchestrator_service.redirect_request(req);
  }

  async update(req: Request): Promise<ResponseDTO> {
    return this.backends_orchestrator_service.redirect_request(req);
  }

  async get_app_displayed_credentials(req: Request): Promise<CredentialsDTO[]> {
    return this.backends_orchestrator_service.redirect_request(req);
  }

  async get_password(req: Request): Promise<string> {
    return this.backends_orchestrator_service.redirect_request(req);
  }

  async remove(req: Request): Promise<ResponseDTO> {
    return this.backends_orchestrator_service.redirect_request(req);
  }

  async has_any(req: Request): Promise<ResponseDTO> {
    return this.backends_orchestrator_service.redirect_request(req);
  }
}
