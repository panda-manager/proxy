import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { EBackend, ResponseDTO } from '../common';
import { AccessTokenResponseDTO } from './dto/access_token_response.dto';
import { BackendsOrchestratorService } from '../modules/backends-orchestrator/backends_orchestrator.service';
import { getDeviceIdentifier } from '../common/utils';
import { RawAxiosRequestHeaders } from 'axios';
import { CreateUserDTO } from '../modules/user/dto/create_user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly backendsOrchestratorService: BackendsOrchestratorService,
  ) {}
  login(req: Request): Promise<AccessTokenResponseDTO> {
    return this.backendsOrchestratorService.redirectRequest(req);
  }

  register(
    req: Request,
    createUserDTO: CreateUserDTO,
    backend: EBackend,
  ): Promise<ResponseDTO> {
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
    return this.backendsOrchestratorService.redirectRequest(req);
  }
}
