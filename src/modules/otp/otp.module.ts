import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { OTPController } from './otp.controller';
import { OTPService } from './otp.service';
import { BackendsOrchestratorModule } from '../backends-orchestrator/backends_orchestrator.module';
import { RedisModule } from '../../config/redis/redis.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    UserModule,
    BackendsOrchestratorModule,
    RedisModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [OTPController],
  providers: [OTPService],
  exports: [OTPService],
})
export class OTPModule {}
