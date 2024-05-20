import { Inject, Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  constructor(@Inject('REDIS_CLIENT') private readonly redis_client: Redis) {}

  async key_exists(key: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.redis_client.exists(key).then((result: number) => {
        resolve(result === 1);
      }, reject);
    });
  }

  async get_key(key: string) {
    return this.redis_client.get(key);
  }

  async insert_key(key: string, value: any) {
    const serializedValue = JSON.stringify(value);
    return this.redis_client.set(key, serializedValue, 'EX', 60);
  }

  async delete_key(key: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.redis_client.del(key).then((result: number) => {
        resolve(result);
      }, reject);
    });
  }
}
