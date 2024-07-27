import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { CredentialsDTO } from './dto/credentials.dto';
import { EBackend, ResponseDTO } from '../../common';
import { BackendsOrchestratorService } from '../backends-orchestrator/backends_orchestrator.service';

@Injectable()
export class CredentialsService {
  constructor(
    private readonly backendsOrchestratorService: BackendsOrchestratorService,
  ) {}

  insert(req: Request): Promise<ResponseDTO> {
    return this.backendsOrchestratorService.redirectRequest(req);
  }

  update(req: Request): Promise<ResponseDTO> {
    return this.backendsOrchestratorService.redirectRequest(req);
  }

  getAppDisplayedCredentials(req: Request): Promise<CredentialsDTO[]> {
    return this.backendsOrchestratorService.redirectRequest(req);
  }

  getPassword(req: Request): Promise<string> {
    return this.backendsOrchestratorService.redirectRequest(req);
  }

  remove(req: Request, backend: EBackend): Promise<ResponseDTO> {
    return this.backendsOrchestratorService.redirectRequest(req, backend);
  }

  hasAny(req: Request): Promise<ResponseDTO> {
    return this.backendsOrchestratorService.redirectRequest(req);
  }

  restore(req: Request, backend: EBackend): Promise<ResponseDTO> {
    return this.backendsOrchestratorService.redirectRequest(req, backend);
  }
}
