import { Request } from 'express';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import { BackendUrl, EBackend } from '../../../common';
import { ConfigService } from '@nestjs/config';
import { Agent } from 'https';
import { throwError } from 'rxjs';

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
      httpsAgent: new Agent({
        rejectUnauthorized: false,
        host: this.getBaseUrl().split('//')[1],
        port: 443,
      }),
    };

    if (config.method === 'GET') delete config.data;

    return axios
      .request(config)
      .then((r) => r.data)
      .catch((error) =>
        throwError(
          () =>
            new HttpException(
              error.response?.data || 'Internal server error',
              error.response?.data.statusCode ||
                HttpStatus.INTERNAL_SERVER_ERROR,
            ),
        ),
      );
  }
}
