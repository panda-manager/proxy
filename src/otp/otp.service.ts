import { Injectable, Logger, NotImplementedException } from '@nestjs/common';
import { UserService } from '../modules/user/user.service';
import { OTPVerifyDTO } from './dto/otp_verify.dto';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ResponseDTO } from '../common';
@Injectable()
export class OTPService {
  private readonly logger = new Logger(OTPService.name);
  constructor(
    private readonly user_service: UserService,
    private readonly config_service: ConfigService,
  ) {}

  async verify_otp(otp_verify_dto: OTPVerifyDTO): Promise<ResponseDTO> {
    throw new NotImplementedException();
  }

  async send_otp(req: Request, email: string): Promise<ResponseDTO> {
    throw new NotImplementedException();
  }
}
