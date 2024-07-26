import { Injectable } from '@nestjs/common';
import { BaseBackendService } from '../base_backend.service';
import { ConfigService } from '@nestjs/config';
import { EBackend } from '../../../../common';

@Injectable()
export class GCPBackendService extends BaseBackendService {
  constructor(protected readonly configService: ConfigService) {
    super(configService, EBackend.GCP);
  }
}
