import { Request } from 'express';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { BackendUrl, EBackend } from '../../../common';
import { ConfigService } from '@nestjs/config';
import { Agent } from 'https';
import { catchError, map, throwError } from 'rxjs';

@Injectable()
export abstract class BaseBackendService {
  protected constructor(
    protected readonly http_service: HttpService,
    protected readonly config_service: ConfigService,
    protected readonly identifier: EBackend,
  ) {}

  async redirect_request(req: Request): Promise<any> {
    const { method, headers, url, body, query, ip } = req;

    // These headers are automatically added
    delete headers['content-length'];
    delete headers['host'];

    // Add x forwarded for
    const existing_xff = headers['x-forwarded-for'] as string;
    headers['x-forwarded-for'] = existing_xff ? `${existing_xff}, ${ip}` : ip;

    const config: AxiosRequestConfig = {
      method,
      url,
      data: body,
      params: query,
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
  async make_request(config: AxiosRequestConfig): Promise<any> {
    config = {
      ...config,
      baseURL: this.base_url(),
      httpsAgent: new Agent({ rejectUnauthorized: false }),
    };

    if (config.method === 'GET') delete config.data;

    return this.http_service.request(config).pipe(
      map((response) => response.data),
      catchError((error) => {
        return throwError(
          () =>
            new HttpException(
              error.response.data,
              error.response.data.statusCode ||
                HttpStatus.INTERNAL_SERVER_ERROR,
            ),
        );
      }),
    );
  }
}
