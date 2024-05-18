import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly logger = new Logger(RedisService.name);
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis_client: ClientProxy,
  ) {}

  onModuleInit() {
    this.redis_client
      .connect()
      .then(() => this.logger.log('Redis client connected!'));
  }

  async key_exists(key: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.redis_client.send('exists', key).subscribe((result: number) => {
        resolve(result === 1);
      }, reject);
    });
  }

  async get_key(key: string) {
    return this.redis_client.emit('get', key).toPromise();
  }

  async insert_key(key: string, value: any) {
    const serializedValue = JSON.stringify(value);
    return this.redis_client.emit('set', { [key]: serializedValue }).toPromise();
  }

  async delete_key(key: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.redis_client.send('del', key).subscribe((result: number) => {
        resolve(result);
      }, reject);
    });
  }
}
