import { Seconds } from '../../../common';

export const OtpTTL: Seconds = 300;

export interface OTPSchema {
  _id: string;
  user_id: string;
  otp: string;
  device: string;
  created_at: Date;
}
