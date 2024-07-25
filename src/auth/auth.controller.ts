import { AuthService } from './auth.service';
import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AccessTokenResponseDTO } from './dto/access_token_response.dto';
import { ResponseDTO } from '../common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth_service: AuthService) {}
  @ApiOkResponse({
    description: 'Access token for future requests. Valid for 1h',
    type: AccessTokenResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Req() req: Request): Promise<AccessTokenResponseDTO> {
    return this.auth_service.login(req);
  }

  @ApiCreatedResponse({
    description: 'User created, OTP sent to email',
    type: ResponseDTO,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Req() req: Request): Promise<ResponseDTO> {
    return await this.auth_service.register(req);
  }

  @ApiOkResponse({
    description: 'User master password validation',
    type: ResponseDTO,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Post('/validate/master')
  async validate_master_password(@Req() req: Request): Promise<ResponseDTO> {
    return this.auth_service.validate_master_password(req);
  }
}
