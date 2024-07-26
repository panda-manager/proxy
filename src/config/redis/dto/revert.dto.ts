import { EBackend, HttpMethod, QueryParams, Seconds } from '../../../common';
import { RawAxiosRequestHeaders } from 'axios';

export const RevertTTL: Seconds = 60;

export interface RevertSchema {
  backend: EBackend;
  uri: string;
  method: HttpMethod;
  params: QueryParams;
  body: JSON;
  headers: RawAxiosRequestHeaders;
}
