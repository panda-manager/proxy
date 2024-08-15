import { AuthService } from './auth.service';
import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { EBackend, ResponseDTO } from '../../common';
import { CreateUserDTO } from '../user/dto/create_user.dto';
import { OTPService } from '../otp/otp.service';
import { UserService } from '../user/user.service';
import { BasicAuthLoginDTO } from './dto/basic_auth_login.dto';
import { getDeviceIdentifier } from '../../common/utils';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly otpService: OTPService,
  ) {}
  @ApiOkResponse({
    description: 'Access token for future requests. Valid for 1h',
    type: ResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Req() req: Request,
    @Body() loginDTO: BasicAuthLoginDTO,
  ): Promise<ResponseDTO> {
    const user = await this.authService.login(req, loginDTO);
    return this.authService.generateJWT(getDeviceIdentifier(req), user);
  }

  @ApiCreatedResponse({
    description: 'User created, OTP sent to email',
    type: ResponseDTO,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(
    @Req() req: Request,
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<ResponseDTO> {
    const isEmailTaken: boolean = !!(await this.userService.find(
      createUserDTO.email,
    ));

    if (isEmailTaken)
      throw new BadRequestException(
        'The email address provided is already taken!',
      );

    await this.authService.register(req, createUserDTO, EBackend.AZURE);
    await this.authService.register(req, createUserDTO, EBackend.GCP);
    await this.otpService.sendOtp(req, createUserDTO.email);

    return {
      message: `Account created, OTP sent to ${createUserDTO.email}`,
    };
  }
}
