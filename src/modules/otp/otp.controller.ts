import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { OTPVerifyDTO } from './dto/otp_verify.dto';
import { OTPService } from './otp.service';
import { Request } from 'express';
import { OTPSendDTO } from './dto/otp_send.dto';
import { ResponseDTO } from '../../common';

@ApiTags('OTP')
@Controller('otp')
export class OTPController {
  constructor(private readonly otpService: OTPService) {}

  @ApiOkResponse({
    status: HttpStatus.OK,
    type: 'text/html',
  })
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'text/html')
  @Get('verify')
  @ApiQuery({
    name: 'email',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'otp',
    type: String,
    required: true,
  })
  async verifyOTP(
    @Query('email') email: string,
    @Query('otp') otp: string,
  ): Promise<ResponseDTO> {
    const otpVerifyDTO: OTPVerifyDTO = { email, otp };
    return await this.otpService.verifyOTP(otpVerifyDTO);
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Post()
  sendOTP(
    @Req() req: Request,
    @Body() otpSendDTO: OTPSendDTO,
  ): Promise<ResponseDTO> {
    return this.otpService.sendOtp(req, otpSendDTO.email);
  }
}
