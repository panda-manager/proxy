import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { EBackend, ResponseDTO } from '../../common';
import { BackendsOrchestratorService } from '../backends-orchestrator/backends_orchestrator.service';
import { getDeviceIdentifier } from '../../common/utils';
import { RawAxiosRequestHeaders } from 'axios';
import { CreateUserDTO } from '../user/dto/create_user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly backendsOrchestratorService: BackendsOrchestratorService,
  ) {}
  login(req: Request): Promise<ResponseDTO> {
    return this.backendsOrchestratorService.redirectRequest(req);
  }

  register(
    req: Request,
    createUserDTO: CreateUserDTO,
    backend: EBackend,
  ): Promise<ResponseDTO> {
    this.logger.debug(`Register recorded for email ${createUserDTO.email}`);

    return this.backendsOrchestratorService.makeRequest(
      {
        url: '/auth/register',
        method: 'POST',
        data: createUserDTO,
        headers: {
          'x-forwarded-for': getDeviceIdentifier(req),
        } as RawAxiosRequestHeaders,
      },
      backend,
    );
  }

  validateMasterPassword(req: Request): Promise<ResponseDTO> {
    this.logger.debug(`Executed master password validation`);

    return this.backendsOrchestratorService.redirectRequest(req);
  }
}
