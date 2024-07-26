import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { EBackend, ResponseDTO } from '../../common';
import { CredentialsDTO } from './dto/credentials.dto';
import { CredentialsService } from './credentials.service';
import { JwtGuard } from '../../auth/jwt.guard';

@ApiTags('Credentials')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentials_service: CredentialsService) {}

  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    type: ResponseDTO,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  insert(@Req() req: Request): Promise<ResponseDTO> {
    return this.credentials_service.insert(req);
  }

  @ApiCreatedResponse({
    status: HttpStatus.OK,
    type: ResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Put()
  update(@Req() req: Request): Promise<ResponseDTO> {
    return this.credentials_service.update(req);
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    type: [CredentialsDTO],
  })
  @ApiQuery({
    name: 'host',
    type: String,
    required: false,
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  get_all(@Req() req: Request): Promise<CredentialsDTO[]> {
    return this.credentials_service.get_app_displayed_credentials(req);
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    type: String,
  })
  @HttpCode(HttpStatus.OK)
  @Post('password')
  get_password(@Req() req: Request): Promise<string> {
    return this.credentials_service.get_password(req);
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Delete()
  async remove(@Req() req: Request): Promise<ResponseDTO> {
    await this.credentials_service.remove(req, EBackend.AZURE);
    return await this.credentials_service.remove(req, EBackend.GCP);
  }

  @ApiQuery({
    name: 'host',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Get('existence')
  has_any(@Req() req: Request): Promise<ResponseDTO> {
    return this.credentials_service.has_any(req);
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Put('restore')
  async restore(@Req() req: Request): Promise<ResponseDTO> {
    await this.credentials_service.restore(req, EBackend.AZURE);
    return await this.credentials_service.restore(req, EBackend.GCP);
  }
}
