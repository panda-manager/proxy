import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { map } from 'rxjs';
import { BackendUrl, EBackend } from '../../../common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export abstract class BaseBackendService {
  protected constructor(
    protected readonly http_service: HttpService,
    protected readonly config_service: ConfigService,
    protected readonly identifier: EBackend,
  ) {}

  async redirect_request(req: Request): Promise<any> {
    const existing_xff = req.headers['X-Forwarded-For'] as string;

    const config: AxiosRequestConfig = {
      method: req.method,
      url: req.url,
      baseURL: this.base_url(),
      data: req.body,
      params: req.params,
      headers: {
        ...req.headers,
        host: this.config_service.get('APP_URL'),
        ['X-Forwarded-For']: !existing_xff
          ? req.ip
          : `${existing_xff}, ${req.ip}`,
      },
    };

    return this.http_service
      .request(config)
      .pipe(map((response) => response.data));
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
      headers: {
        ...config.headers,
        host: this.config_service.get('APP_URL'),
      },
      baseURL: this.base_url(),
    };

    return this.http_service
      .request(config)
      .pipe(map((response) => response.data));
  }
}
