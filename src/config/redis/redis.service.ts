import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis_client: ClientProxy,
  ) {}

  connect(): Promise<void> {
    return this.redis_client.connect();
  }

  async key_exists(key: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.redis_client.send('exists', key).subscribe((result: number) => {
        resolve(result === 1);
      }, reject);
    });
  }

  async get_key(key: string): Promise<any | null> {
    return new Promise<any | null>((resolve, reject) => {
      this.redis_client.send('get', key).subscribe((result: string | null) => {
        resolve(JSON.parse(result));
      }, reject);
    });
  }

  async insert_key(key: string, value: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const serializedValue = JSON.stringify(value);
      this.redis_client.send('set', [key, serializedValue]).subscribe(() => {
        resolve(true);
      }, reject);
    });
  }

  async delete_key(key: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.redis_client.send('del', key).subscribe((result: number) => {
        resolve(result);
      }, reject);
    });
  }
}
