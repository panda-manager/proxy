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
    protected readonly configService: ConfigService,
    protected readonly identifier: EBackend,
  ) {}

  redirectRequest(req: Request): Promise<any> {
    const { method, headers, url, body, query, ip } = req;
    const existingXFF = headers['x-forwarded-for'] as string;

    const config: AxiosRequestConfig = {
      method,
      url: url.toString().split('?')[0] ?? url,
      data: body,
      params: query,
      headers: {
        authorization: headers.authorization,
        ['x-forwarded-for']: existingXFF ? `${existingXFF}, ${ip}` : ip,
      } as RawAxiosRequestHeaders,
    };

    return this.makeRequest(config);
  }

  which(): EBackend {
    return this.identifier;
  }

  protected getBaseUrl(): string {
    return BackendUrl[this.identifier];
  }
  makeRequest(config: AxiosRequestConfig): Promise<any> {
    config = {
      ...config,
      baseURL: this.getBaseUrl(),
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
