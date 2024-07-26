import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import environments from './environments';
import { AuthModule } from './auth/auth.module';
import { CredentialsModule } from './modules/credentials/credentials.module';
import { UserModule } from './modules/user/user.module';
import { OTPModule } from './otp/otp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environments],
    }),
    CredentialsModule,
    AuthModule,
    UserModule,
    OTPModule,
  ],
})
export class AppModule {}
