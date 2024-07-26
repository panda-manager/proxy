import { AZURE_BACKEND_URL, GCP_BACKEND_URL } from '../environments';
import { RevertSchema } from '../config/redis/dto/revert.dto';

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

export type Omit<Type, Keys extends keyof Type> = {
  [Key in Exclude<keyof Type, Keys>]: Type[Key];
};

export type TRevertsMap = {
  [url: string]: Partial<{
    [method in HttpMethod]: (info: RevertSchema) => Promise<void>;
  }>;
};
