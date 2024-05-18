import { Injectable, Logger, NotImplementedException } from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from './entity/user.entity';
import { CreateUserDTO } from './dto/create_user.dto';
import { ResponseDTO } from '../../common';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor() {}

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
}
