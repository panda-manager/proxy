import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { BackendUrl, EBackend } from '../../../common';
import { ConfigService } from '@nestjs/config';
import { Agent } from 'https';
import { map } from 'rxjs';

@Injectable()
export abstract class BaseBackendService {
  protected constructor(
    protected readonly http_service: HttpService,
    protected readonly config_service: ConfigService,
    protected readonly identifier: EBackend,
  ) {}

  async redirect_request(req: Request): Promise<any> {
    const { method, headers, url, body, params } = req;
    delete headers['content-length'];
    delete headers['host'];

    const config: AxiosRequestConfig = {
      method,
      url,
      data: body,
      params,
      headers,
    };

    return this.make_request(config);
  }

  which(): EBackend {
    return this.identifier;
  }

  protected base_url(): string {
    return BackendUrl[this.identifier];
  }
  make_request(config: AxiosRequestConfig): any {
    config = {
      ...config,
      baseURL: this.base_url(),
      httpsAgent: new Agent({ rejectUnauthorized: false }),
    };

    return this.http_service
      .request(config)
      .pipe(map((response) => response.data));
  }
}
