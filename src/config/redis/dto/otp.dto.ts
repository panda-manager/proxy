export interface OtpDTO {
  _id: string;
  user_id: string;
  otp: string;
  device: string;
  created_at: Date;
}
