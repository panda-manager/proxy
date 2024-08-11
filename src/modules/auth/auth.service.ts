import { ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { EBackend, ResponseDTO } from '../../common';
import { BackendsOrchestratorService } from '../backends-orchestrator/backends_orchestrator.service';
import { getDeviceIdentifier } from '../../common/utils';
import { RawAxiosRequestHeaders } from 'axios';
import { CreateUserDTO } from '../user/dto/create_user.dto';
import { BasicAuthLoginDTO } from './dto/basic_auth_login.dto';
import { UserEntity } from '../user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { DeviceStatus } from '../user/enum/device_status';
import { OTPService } from '../otp/otp.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly backendsOrchestratorService: BackendsOrchestratorService,
    private readonly otpService: OTPService,
    private readonly jwtService: JwtService,
  ) {}
  async login(req: Request, loginDTO: BasicAuthLoginDTO): Promise<UserEntity> {
    this.logger.log(`Login attempted for user ${loginDTO.email}`);

    console.log(getDeviceIdentifier(req));
    const user = await this.backendsOrchestratorService
      .makeRequest({
        url: '/auth/login',
        method: 'POST',
        data: loginDTO,
        headers: {
          'x-forwarded-for': getDeviceIdentifier(req),
        } as RawAxiosRequestHeaders,
      })
      .then((r) => r.data);

    if (!user)
      throw new UnauthorizedException('Username or password are incorrect');

    const requestDevice = user.devices.find(
      (item) => item.identifier === getDeviceIdentifier(req),
    );

    if (
      !requestDevice ||
      requestDevice.status === DeviceStatus.PENDING_VERIFICATION
    ) {
      await this.otpService.sendOtp(req, loginDTO.email);
      throw new ForbiddenException(
        `Requested device is not a trusted device, OTP sent to ${loginDTO.email}`,
      );
    }

    return user;
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

  async generateJWT(device: string, user: UserEntity): Promise<ResponseDTO> {
    if (!user) throw new UnauthorizedException();

    const accessToken = this.jwtService.sign({
      sub: user.email,
      device,
    });

    return { data: { access_token: accessToken } };
  }
}
