import { Injectable } from '@nestjs/common';
import { BaseBackendService } from '../base_backend.service';
import { BACKEND_URL_1 } from '../../../../environments';

@Injectable()
export class BackendReg1Service extends BaseBackendService {
  protected get_base_url(): string {
    return BACKEND_URL_1;
  }
}
