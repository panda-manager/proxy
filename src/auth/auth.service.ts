import { Injectable, Logger, NotImplementedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BasicAuthLoginDTO } from './dto/basic_auth_login.dto';
import { UserService } from '../modules/user/user.service';
import { Request } from 'express';
import { CreateUserDTO } from '../modules/user/dto/create_user.dto';
import { OTPService } from '../otp/otp.service';
import { ResponseDTO } from '../common';
import { AccessTokenResponseDTO } from './dto/access_token_response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwt_service: JwtService,
    private readonly user_service: UserService,
    private readonly otp_service: OTPService,
  ) {}
  async login(
    req: Request,
    user: BasicAuthLoginDTO,
  ): Promise<AccessTokenResponseDTO> {
    throw new NotImplementedException();
  }

  async register(
    req: Request,
    register_dto: CreateUserDTO,
  ): Promise<ResponseDTO> {
    throw new NotImplementedException();
  }

  async validate_master_password(
    req: Request,
    master_password: string,
  ): Promise<ResponseDTO> {
    throw new NotImplementedException();
  }
}
