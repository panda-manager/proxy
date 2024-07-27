import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { EBackend, ResponseDTO } from '../../common';
import { BackendsOrchestratorService } from '../backends-orchestrator/backends_orchestrator.service';
import { UserEntity } from './entity/user.entity';
import { DeviceVerifyDTO } from './dto/device_verify.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly backendsOrchestratorService: BackendsOrchestratorService,
  ) {}

  async validateMasterPassword(req: Request): Promise<ResponseDTO> {
    this.logger.debug('Validate password executed');

    return this.backendsOrchestratorService.redirectRequest(req);
  }

  async addDevice(
    user: UserEntity,
    device: string,
    backend: EBackend,
  ): Promise<ResponseDTO> {
    this.logger.log(
      `Adding device ${device} for user ${user.email} on ${EBackend[backend]}`,
    );

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
    this.logger.log(
      `Setting device ${device} for user ${user.email} on ${EBackend[backend]} as verified`,
    );

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

  find(email: string): Promise<UserEntity> {
    this.logger.debug(`Searching user ${email}`);

    return this.backendsOrchestratorService
      .makeRequest({
        params: { email },
        url: '/user/find',
        method: 'GET',
      })
      .then((res) => res.data);
  }
}
