import { Injectable, Logger, NotImplementedException } from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from './entity/user.entity';
import { CreateUserDTO } from './dto/create_user.dto';
import { ResponseDTO } from '../../common';
import { BackendsOrchestratorService } from '../backends-orchestrator/backends_orchestrator.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly backends_orchestrator_service: BackendsOrchestratorService,
  ) {}

  findOneBy(where: any): Promise<UserEntity> {
    throw new NotImplementedException();
  }

  async insert(req: Request, create_dto: CreateUserDTO): Promise<ResponseDTO> {
    throw new NotImplementedException();
  }

  async set_device_as_verified(
    user: UserEntity,
    device: string,
  ): Promise<ResponseDTO> {
    throw new NotImplementedException();
  }

  async validate_master_password(req: Request): Promise<ResponseDTO> {
    return this.backends_orchestrator_service.redirect_request(req);
  }
}
