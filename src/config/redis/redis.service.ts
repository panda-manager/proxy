import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { EBackend, HttpHeaders, HttpMethod, QueryParams } from '../../common';

export type TRedisDocument = {
  backend: EBackend;
  uri: string;
  method: HttpMethod;
  params: QueryParams;
  body: JSON;
  headers: HttpHeaders;
};

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis_client: Redis) {}

  async key_exists(key: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.redis_client.exists(key).then((result: number) => {
        resolve(result === 1);
      }, reject);
    });
  }

  async get_key(key: string) {
    const value = await this.redis_client.get(key);
    return JSON.parse(value) as TRedisDocument;
  }

  async insert_key(key: string, value: TRedisDocument) {
    const serializedValue = JSON.stringify(value);

    const res = this.redis_client.set(key, serializedValue);
    await this.redis_client.expire(key, 60);

    return res;
  }

  async delete_key(key: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.redis_client.del(key).then((result: number) => {
        resolve(result);
      }, reject);
    });
  }
}
