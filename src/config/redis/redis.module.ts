import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { REDIS_CONFIG } from '../../environments';
import { RedisService } from './redis.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REDIS_CLIENT',
        transport: Transport.REDIS,
        options: {
          host: REDIS_CONFIG.HOST,
          port: REDIS_CONFIG.PORT,
          username: REDIS_CONFIG.USER,
          password: REDIS_CONFIG.PASS,
        },
      },
    ]),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
