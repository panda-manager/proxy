import { Inject, Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RevertSchema } from './dto/revert.dto';
import { Seconds } from '../../common';
import { OTPSchema } from './dto/otp.dto';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {
    redisClient.on('error', (error) => {
      this.logger.log(error);
    });
  }

  keyExists(key: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.redisClient.exists(key).then((result: number) => {
        resolve(result === 1);
      }, reject);
    });
  }

  async getKey(key: string): Promise<any> {
    const value = await this.redisClient.get(key);
    return JSON.parse(value);
  }

  async insertKey(
    key: string,
    value: RevertSchema | OTPSchema,
    expire: Seconds,
  ) {
    const serializedValue = JSON.stringify(value);

    const res = this.redisClient.set(key, serializedValue);
    await this.redisClient.expire(key, expire);

    return res;
  }

  deleteKey(key: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.redisClient.del(key).then((result: number) => {
        resolve(result);
      }, reject);
    });
  }
}
