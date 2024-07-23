import { Module } from '@nestjs/common';
import { createClient, RedisClientOptions } from 'redis';
import { RedisService } from './redis.service';
import { REDIS_URL } from '../../environments';

@Module({
  providers: [
    {
      provide: 'REDIS_OPTIONS',
      useValue: {
        url: REDIS_URL,
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
