import { Seconds } from '../../../common';

export const OtpTTL: Seconds = 300;

export interface OTPSchema {
  email: string;
  otp: string;
  device: string;
  created_at: Date;
}
