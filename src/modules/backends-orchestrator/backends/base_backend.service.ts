import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { map } from 'rxjs';

@Injectable()
export abstract class BaseBackendService {
  constructor(protected readonly http_service: HttpService) {}
  async redirect_request(req: Request): Promise<any> {
    const config: AxiosRequestConfig = {
      method: req.method,
      url: req.url,
      baseURL: this.get_base_url(),
      data: req.body,
      params: req.params,
      headers: {
        ...req.headers,
        host: 'panda-manager-proxy.io', //TODO
        ['X-Forwarded-For']: !req.headers['X-Forwarded-For']
          ? req.ip
          : `${req.headers['X-Forwarded-For']}, ${req.ip}`,
      },
    };

    return this.http_service
      .request(config)
      .pipe(map((response) => response.data));
  }
  protected abstract get_base_url(): string;
}
