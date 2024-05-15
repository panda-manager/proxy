import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import environments from './environments';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environments],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {}
}
