import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RevertSchema } from './dto/revert.dto';

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
    return JSON.parse(value) as RevertSchema;
  }

  async insert_key(key: string, value: RevertSchema, expire_seconds: number) {
    const serializedValue = JSON.stringify(value);

    const res = this.redis_client.set(key, serializedValue);
    await this.redis_client.expire(key, expire_seconds);

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
