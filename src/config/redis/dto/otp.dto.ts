import { Seconds } from '../../../common';

export const OtpTTL: Seconds = 300;

export interface OTPSchema {
  user_id: string;
  otp: string;
  device: string;
  created_at: Date;
}
