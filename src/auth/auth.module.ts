import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../modules/user/user.module';
import { OTPModule } from '../otp/otp.module';
import { CustomStrategy } from './custom.strategy';
import { BackendsOrchestratorModule } from '../modules/backends-orchestrator/backends_orchestrator.module';

@Module({
  imports: [
    OTPModule,
    UserModule,
    BackendsOrchestratorModule,
    PassportModule.register({ defaultStrategy: 'custom', session: true }),
  ],
  providers: [AuthService, CustomStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
