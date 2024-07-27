import { AuthService } from './auth.service';
import {
  Body,
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
import { EBackend, ResponseDTO } from '../common';
import { JwtGuard } from './jwt.guard';
import { CreateUserDTO } from '../modules/user/dto/create_user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOkResponse({
    description: 'Access token for future requests. Valid for 1h',
    type: AccessTokenResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Req() req: Request): Promise<AccessTokenResponseDTO> {
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
    await this.authService.register(req, createUserDTO, EBackend.AZURE);
    return await this.authService.register(req, createUserDTO, EBackend.GCP);
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
  async validateMasterPassword(@Req() req: Request): Promise<ResponseDTO> {
    return this.authService.validateMasterPassword(req);
  }
}
