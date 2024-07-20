import { AZURE_BACKEND_URL, GCP_BACKEND_URL } from '../environments';

export const APP_NAME = 'Panda Manager - Proxy';
export const PAIR_UUID_HEADER = 'x-pair-redis-key';
export enum EBackend {
  AZURE = 1,
  GCP = 2,
}

type TBackendUrl = {
  [key in EBackend]: string;
};
export const BackendUrl: TBackendUrl = {
  [EBackend.AZURE]: AZURE_BACKEND_URL,
  [EBackend.GCP]: GCP_BACKEND_URL,
};

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type QueryParams = {
  [key: string]: string;
};

export type HttpHeaders = {
  [key: string]: any;
};

export * from './responses/response.dto';
export * from './responses/error_response.dto';
