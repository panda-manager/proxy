import { Injectable } from '@nestjs/common';
import { BaseBackendService } from '../base_backend.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { EBackend } from '../../../../common';

@Injectable()
export class GCPBackendService extends BaseBackendService {
  constructor(
    protected readonly http_service: HttpService,
    protected readonly config_service: ConfigService,
  ) {
    super(http_service, config_service, EBackend.GCP);
  }
}
