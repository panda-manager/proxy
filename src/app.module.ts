import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import environments from './environments';
import { CredentialsModule } from './modules/credentials/credentials.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environments],
    }),
    CredentialsModule,
    UserModule,
  ],
})
export class AppModule {}
