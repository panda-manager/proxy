import { Injectable } from '@nestjs/common';
import { BaseBackendService } from '../base_backend.service';
import { ConfigService } from '@nestjs/config';
import { EBackend } from '../../../../common';

@Injectable()
export class GCPBackendService extends BaseBackendService {
  constructor(protected readonly config_service: ConfigService) {
    super(config_service, EBackend.GCP);
  }
}
