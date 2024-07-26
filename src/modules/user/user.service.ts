import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { EBackend, ResponseDTO } from '../../common';
import { BackendsOrchestratorService } from '../backends-orchestrator/backends_orchestrator.service';
import { UserEntity } from './entity/user.entity';
import { DeviceVerifyDTO } from './dto/device_verify.dto';

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

  async setDeviceVerified(
    user: UserEntity,
    device: string,
    backend: EBackend,
  ): Promise<ResponseDTO> {
    return this.backendsOrchestratorService.makeRequest(
      {
        url: '/user/device/verify',
        method: 'PUT',
        data: {
          email: user.email,
          device,
        } as DeviceVerifyDTO,
      },
      backend,
    );
  }

  async find(email: string): Promise<UserEntity> {
    return await this.backendsOrchestratorService.makeRequest({
      data: { email },
      url: '/user/find',
      method: 'GET',
    });
  }
}
