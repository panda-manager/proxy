import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import environments, { REDIS_CONFIG } from './environments';
import { CredentialsController } from './modules/credentials/credentials.controller';
import { AuthController } from './auth/auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environments],
    }),
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
  controllers: [AppController, CredentialsController, AuthController],
  providers: [AppService],
})
export class AppModule {}
