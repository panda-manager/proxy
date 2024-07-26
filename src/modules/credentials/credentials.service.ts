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

  async insert(req: Request): Promise<ResponseDTO> {
    return this.backendsOrchestratorService.redirectRequest(req);
  }

  async update(req: Request): Promise<ResponseDTO> {
    return this.backendsOrchestratorService.redirectRequest(req);
  }

  async getAppDisplayedCredentials(req: Request): Promise<CredentialsDTO[]> {
    return this.backendsOrchestratorService.redirectRequest(req);
  }

  async getPassword(req: Request): Promise<string> {
    return this.backendsOrchestratorService.redirectRequest(req);
  }

  remove(req: Request, backend: EBackend): Promise<ResponseDTO> {
    return this.backendsOrchestratorService.redirectRequest(req, backend);
  }

  async hasAny(req: Request): Promise<ResponseDTO> {
    return this.backendsOrchestratorService.redirectRequest(req);
  }

  async restore(req: Request, backend: EBackend): Promise<ResponseDTO> {
    return this.backendsOrchestratorService.redirectRequest(req, backend);
  }
}
