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
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async verifyOTP(otpVerifyDTO: OTPVerifyDTO): Promise<ResponseDTO> {
    throw new NotImplementedException();
  }

  async sendOtp(req: Request, email: string): Promise<ResponseDTO> {
    throw new NotImplementedException();
  }
}
