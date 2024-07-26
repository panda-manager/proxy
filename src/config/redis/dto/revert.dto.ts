import {
  EBackend,
  HttpHeaders,
  HttpMethod,
  QueryParams,
} from '../../../common';

export interface RevertSchema {
  backend: EBackend;
  uri: string;
  method: HttpMethod;
  params: QueryParams;
  body: JSON;
  headers: HttpHeaders;
}
