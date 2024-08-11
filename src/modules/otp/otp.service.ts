import { BadRequestException, forwardRef, ImATeapotException, Inject, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { OTPVerifyDTO } from './dto/otp_verify.dto';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { EBackend, ResponseDTO } from '../../common';
import { UserEntity } from '../user/entity/user.entity';
import { BackendsOrchestratorService } from '../backends-orchestrator/backends_orchestrator.service';
import { getDeviceIdentifier, mailSender } from '../../common/utils';
import { DeviceStatus } from '../user/enum/device_status';
import { generate as generateOtp } from 'otp-generator';
import { RedisService } from '../../config/redis/redis.service';
import { OTPSchema, OtpTTL } from '../../config/redis/dto/otp.dto';
import * as nodemailer from 'nodemailer';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class OTPService {
  private readonly logger = new Logger(OTPService.name);
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly backendsOrchestratorService: BackendsOrchestratorService,
    private readonly redisService: RedisService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async verifyOTP(otpVerifyDTO: OTPVerifyDTO): Promise<ResponseDTO> {
    const user: UserEntity = await this.userService.find(otpVerifyDTO.email);

    if (!user)
      throw new BadRequestException(
        `No such user with email ${otpVerifyDTO.email}`,
      );

    const foundOTP: OTPSchema = await this.redisService.getKey(
      `otp:${otpVerifyDTO.otp}`,
    );

    if (!foundOTP)
      throw new BadRequestException(
        `No such OTP found for user ${otpVerifyDTO.email}`,
      );

    await this.userService.setDeviceVerified(
      user,
      foundOTP.device,
      EBackend.AZURE,
    );

    await this.userService.setDeviceVerified(
      user,
      foundOTP.device,
      EBackend.GCP,
    );

    this.logger.debug(`Verified device for user ${otpVerifyDTO.email}`);
    await this.redisService.deleteKey(`otp:${otpVerifyDTO.otp}`);

    return this.authService.generateJWT(foundOTP.device, user);
  }

  private async sendVerificationEmail(
    email: string,
    otp: string,
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('OTP_MAIL_ACCOUNT').USER,
        pass: this.configService.get('OTP_MAIL_ACCOUNT').PASS,
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      },
    });

    await mailSender(
      transporter,
      email,
      this.configService.get('OTP_MAIL_ACCOUNT').USER,
      'Verification Email',
      `<html lang="en">
            <body>
            <h1>Please confirm your OTP</h1>
                   <p>Here is your OTP code: ${otp}</p>
                   <p>Please visit this link to verify the device you requested the code from:</p>
                   <a href=${this.configService.get('APP_URL')}/otp/verify?otp=${otp}&email=${email}>Click here!</a>
            </body>
            </html>`,
    );

    this.logger.debug(`OTP mail sent successfully to ${email}`);
  }

  async sendOtp(req: Request, email: string): Promise<ResponseDTO> {
    const device = getDeviceIdentifier(req);
    const user: UserEntity = await this.userService.find(email);
    const userDevice = user.devices.find(
      (element) => element.identifier === device,
    );

    if (!user)
      throw new BadRequestException(`No such user with email ${email}`);
    else if (userDevice && userDevice.status === DeviceStatus.VERIFIED)
      throw new ImATeapotException(
        `Device ${device} is already verified for user ${user.email}`,
      );

    let otp = generateOtp(6);
    let result = await this.redisService.keyExists(`otp:${otp}`);

    while (result) {
      otp = generateOtp(6);
      result = await this.redisService.keyExists(`otp:${otp}`);
    }

    const otpPayload: OTPSchema = {
      email: user.email,
      otp,
      device,
      created_at: new Date(),
    };

    await this.redisService.insertKey(`otp:${otp}`, otpPayload, OtpTTL);

    if (!device) {
      await this.userService.addDevice(user, device, EBackend.AZURE);
      await this.userService.addDevice(user, device, EBackend.GCP);
    }

    await this.sendVerificationEmail(email, otp);
    const message = `OTP generated for user ${user.email}, device ${otpPayload.device}`;
    this.logger.debug(message);

    return { message };
  }
}
