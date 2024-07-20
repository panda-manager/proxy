import { Injectable } from '@nestjs/common';
import { BaseBackendService } from '../base_backend.service';
import { HttpService } from '@nestjs/axios';
import { EBackend } from '../../../../common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AzureBackendService extends BaseBackendService {
  constructor(
    protected readonly http_service: HttpService,
    protected readonly config_service: ConfigService,
  ) {
    super(http_service, config_service, EBackend.AZURE);
  }
}
