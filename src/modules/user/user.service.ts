import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { EBackend, ResponseDTO } from '../../common';
import { BackendsOrchestratorService } from '../backends-orchestrator/backends_orchestrator.service';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly backendsOrchestratorService: BackendsOrchestratorService,
  ) {}

  async validateMasterPassword(req: Request): Promise<ResponseDTO> {
    return this.backendsOrchestratorService.redirectRequest(req);
  }

  async addDevice(
    user: UserEntity,
    device: string,
    backend: EBackend,
  ): Promise<ResponseDTO> {
    return this.backendsOrchestratorService.makeRequest(
      {
        url: '/user/device',
        method: 'POST',
        data: {
          email: user.email,
          device,
        },
      },
      backend,
    );
  }
}
