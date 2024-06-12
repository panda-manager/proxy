import { Injectable } from '@nestjs/common';
import { BaseBackendService } from '../base_backend.service';
import { HttpService } from '@nestjs/axios';
import { EBackend } from '../../../../common';

@Injectable()
export class AzureBackendService extends BaseBackendService {
  constructor(protected readonly http_service: HttpService) {
    super(http_service, EBackend.AZURE);
  }
}
