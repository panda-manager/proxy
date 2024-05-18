import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import environments from './environments';
import { CredentialsController } from './modules/credentials/credentials.controller';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environments],
    }),
  ],
  controllers: [AppController, CredentialsController, AuthController],
  providers: [AppService],
})
export class AppModule {}
