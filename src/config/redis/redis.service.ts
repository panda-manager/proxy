import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RevertSchema } from './dto/revert.dto';
import { Seconds } from '../../common';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async keyExists(key: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.redisClient.exists(key).then((result: number) => {
        resolve(result === 1);
      }, reject);
    });
  }

  async getKey(key: string) {
    const value = await this.redisClient.get(key);
    return JSON.parse(value) as RevertSchema;
  }

  async insertKey(key: string, value: RevertSchema, expire: Seconds) {
    const serializedValue = JSON.stringify(value);

    const res = this.redisClient.set(key, serializedValue);
    await this.redisClient.expire(key, expire);

    return res;
  }

  async deleteKey(key: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.redisClient.del(key).then((result: number) => {
        resolve(result);
      }, reject);
    });
  }
}
