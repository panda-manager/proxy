import { AuthService } from './auth.service';
import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { AccessTokenResponseDTO } from './dto/access_token_response.dto';
import { EBackend, ResponseDTO } from '../common';
import { JwtGuard } from './jwt.guard';
import { CreateUserDTO } from '../modules/user/dto/create_user.dto';
import { OTPService } from '../otp/otp.service';
import { UserService } from '../modules/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly otpService: OTPService,
  ) {}
  @ApiOkResponse({
    description: 'Access token for future requests. Valid for 1h',
    type: AccessTokenResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Req() req: Request): Promise<AccessTokenResponseDTO> {
    return this.authService.login(req);
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

  // TODO: Delete
  @ApiOkResponse({
    description: 'User master password validation',
    type: ResponseDTO,
  })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/validate/master')
  validateMasterPassword(@Req() req: Request): Promise<ResponseDTO> {
    return this.authService.validateMasterPassword(req);
  }
}
