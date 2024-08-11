import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { BackendsOrchestratorModule } from '../backends-orchestrator/backends_orchestrator.module';
import { UserModule } from '../user/user.module';
import { OTPModule } from '../otp/otp.module';
import { JwtModule } from '@nestjs/jwt';
import { ACCESS_TOKEN_SECRET } from '../../environments';
import authTokenConfig from './config/auth_token_config';

@Module({
  imports: [
    BackendsOrchestratorModule,
    UserModule,
    OTPModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: true }),
    JwtModule.register({
      secret: ACCESS_TOKEN_SECRET,
      signOptions: authTokenConfig,
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
