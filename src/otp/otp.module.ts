import { Module } from '@nestjs/common';
import { UserModule } from '../modules/user/user.module';
import { OTPController } from './otp.controller';
import { OTPService } from './otp.service';
import { BackendsOrchestratorModule } from '../modules/backends-orchestrator/backends_orchestrator.module';
import { RedisModule } from '../config/redis/redis.module';

@Module({
  imports: [UserModule, BackendsOrchestratorModule, RedisModule],
  controllers: [OTPController],
  providers: [OTPService],
  exports: [OTPService],
})
export class OTPModule {}
