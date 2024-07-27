import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { BackendsOrchestratorModule } from '../backends-orchestrator/backends_orchestrator.module';
import { UserModule } from '../user/user.module';
import { OTPModule } from '../otp/otp.module';

@Module({
  imports: [
    BackendsOrchestratorModule,
    UserModule,
    OTPModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: true }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
