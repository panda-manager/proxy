import { Module } from '@nestjs/common';
import { UserModule } from '../modules/user/user.module';
import { OTPController } from './otp.controller';
import { OTPService } from './otp.service';

@Module({
  imports: [UserModule],
  controllers: [OTPController],
  providers: [OTPService],
  exports: [OTPService],
})
export class OTPModule {}
