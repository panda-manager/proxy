import { Injectable, Logger, NotImplementedException } from '@nestjs/common';
import { CreateCredentialsDTO } from './dto/create_credentials.dto';
import { Request } from 'express';
import { AuthService } from '../../auth/auth.service';
import { AppDisplayedCredentialsDTO } from './dto/app_displayed_credentials';
import { UpdateCredentialsDTO } from './dto/update_credentials.dto';
import { DeleteCredentialsDTO } from './dto/delete_credentials.dto';
import { GetPasswordDTO } from './dto/get_password.dto';
import { ResponseDTO } from '../../common';
import { BackendsOrchestratorService } from '../backends-orchestrator/backends_orchestrator.service';

@Injectable()
export class CredentialsService {
  private readonly logger = new Logger(CredentialsService.name);

  constructor(
    private readonly auth_service: AuthService,
    private readonly backends_orchestrator_service: BackendsOrchestratorService,
  ) {}

  async insert(
    req: Request,
    create_dto: CreateCredentialsDTO,
  ): Promise<ResponseDTO> {
    throw new NotImplementedException();
  }

  async update(
    req: Request,
    update_dto: UpdateCredentialsDTO,
  ): Promise<ResponseDTO> {
    throw new NotImplementedException();
  }

  async get_app_displayed_credentials(
    req: Request,
  ): Promise<AppDisplayedCredentialsDTO[]> {
    return this.backends_orchestrator_service.redirect_request(req);
  }

  async get_password(
    req: Request,
    get_password_dto: GetPasswordDTO,
  ): Promise<string> {
    throw new NotImplementedException();
  }

  async remove(
    req: Request,
    delete_dto: DeleteCredentialsDTO,
  ): Promise<ResponseDTO> {
    throw new NotImplementedException();
  }

  async has_any(req: Request, host: string): Promise<ResponseDTO> {
    throw new NotImplementedException();
  }
}
