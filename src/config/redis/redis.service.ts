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

  async keyExists(key: string): Promise<boolean> {
    return !!(await this.getKey(key));
  }

  async getKey(key: string): Promise<any> {
    this.logger.debug(`Checking if key ${key} exists`);
    const value = await this.redisClient.get(key);

    if (!value) {
      this.logger.debug(`Key ${key} found`);
      return null;
    }

    this.logger.debug(`Key ${key} not found`);
    return JSON.parse(value);
  }

  async insertKey(
    key: string,
    value: RevertSchema | OTPSchema,
    expire: Seconds,
  ) {
    const serializedValue = JSON.stringify(value);

    this.logger.debug(`Inserting [${key}]: ${serializedValue}`);
    const res = this.redisClient.set(key, serializedValue);
    await this.redisClient.expire(key, expire);

    return res;
  }

  deleteKey(key: string): Promise<number> {
    this.logger.debug(`Attempting deletion for key ${key}`);

    return new Promise<number>((resolve, reject) => {
      this.redisClient.del(key).then((result: number) => {
        this.logger.debug(`Key ${key} deleted`);
        resolve(result);
      }, reject);
    });
  }
}
