import { EBackend, HttpMethod, QueryParams } from '../../../common';
import { RawAxiosRequestHeaders } from 'axios';

export interface RevertSchema {
  backend: EBackend;
  uri: string;
  method: HttpMethod;
  params: QueryParams;
  body: JSON;
  headers: RawAxiosRequestHeaders;
}
