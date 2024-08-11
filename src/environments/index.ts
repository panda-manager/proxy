import { expand as expandDotenv } from 'dotenv-expand';
import { configDotenv } from 'dotenv';

const env = configDotenv();
expandDotenv(env);

const WHITE_LIST = ['*'];
export const CORS_HANDLER = (origin: string, callback: CallableFunction) => {
  if (!origin) {
    callback(null, true);
    return;
  }

  if (WHITE_LIST.includes('*') || WHITE_LIST.includes(origin))
    callback(null, true);
  else callback(new Error('Not allowed by CORS'), false);
};
export const NODE_ENV = process.env.NODE_ENV;
export const APP_PORT = parseInt(process.env.APP_PORT || '');
export const APP_URL = process.env.APP_URL;
export const OTP_MAIL_ACCOUNT = {
  USER: process.env.OTP_MAIL_USER,
  PASS: process.env.OTP_MAIL_PASSWORD,
};

export const AZURE_BACKEND_URL = process.env.AZURE_BACKEND_URL;
export const GCP_BACKEND_URL = process.env.GCP_BACKEND_URL;

export const REDIS_URL = process.env.REDIS_URL;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export default () => ({
  CORS_HANDLER,
  REDIS_URL,
  OTP_MAIL_ACCOUNT,
  APP_URL,
  APP_PORT,
  NODE_ENV,
  AZURE_BACKEND_URL,
  GCP_BACKEND_URL,
  ACCESS_TOKEN_SECRET,
});
