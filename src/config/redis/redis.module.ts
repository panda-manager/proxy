import { Module } from '@nestjs/common';
import { createClient, RedisClientOptions } from 'redis';
import { RedisService } from './redis.service';
import { REDIS_CONFIG } from '../../environments';

@Module({
  providers: [
    {
      provide: 'REDIS_OPTIONS',
      useValue: {
        host: REDIS_CONFIG.HOST,
        port: REDIS_CONFIG.PORT,
        username: REDIS_CONFIG.USER,
        password: REDIS_CONFIG.PASS,
      } as RedisClientOptions,
    },
    {
      inject: ['REDIS_OPTIONS'],
      provide: 'REDIS_CLIENT',
      useFactory: async (options: RedisClientOptions) => {
        const client = createClient(options);
        await client.connect();
        return client;
      },
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
