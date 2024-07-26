import { Request } from 'express';
import { HttpException, Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import { BackendUrl, EBackend } from '../../../common';
import { ConfigService } from '@nestjs/config';
import { Agent } from 'https';
import { throwError } from 'rxjs';
import { NODE_ENV } from '../../../environments';

@Injectable()
export abstract class BaseBackendService {
  protected constructor(
    protected readonly config_service: ConfigService,
    protected readonly identifier: EBackend,
  ) {}

  async redirect_request(req: Request): Promise<any> {
    const { method, headers, url, body, query, ip } = req;
    const existing_xff = headers['x-forwarded-for'] as string;

    const config: AxiosRequestConfig = {
      method,
      url,
      data: body,
      params: query,
      headers: {
        authorization: headers.authorization,
        ['x-forwarded-for']: existing_xff ? `${existing_xff}, ${ip}` : ip,
      } as RawAxiosRequestHeaders,
    };

    return this.make_request(config);
  }

  which(): EBackend {
    return this.identifier;
  }

  protected base_url(): string {
    return BackendUrl[this.identifier];
  }
  async make_request(config: AxiosRequestConfig): Promise<any> {
    config = {
      ...config,
      baseURL: this.base_url(),
      httpsAgent: new Agent({ rejectUnauthorized: NODE_ENV === 'production' }),
    };

    if (config.method === 'GET') delete config.data;

    return axios
      .request(config)
      .then((r) => r.data)
      .catch((error) =>
        throwError(
          () =>
            new HttpException(
              error.response.data,
              error.response.data.statusCode,
            ),
        ),
      );
  }
}
