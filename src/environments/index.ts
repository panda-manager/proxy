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
  HOST: process.env.OTP_MAIL_HOST,
  PORT: process.env.OTP_MAIL_PORT,
  USER: process.env.OTP_MAIL_USER,
  PASS: process.env.OTP_MAIL_PASSWORD,
};

export const BACKEND_URL_1 = 'https://back1.panda.com';
export const BACKEND_URL_2 = 'https://back2.panda.com';

export const REDIS_URL = process.env.REDIS_URL;

export default () => ({
  CORS_HANDLER,
  REDIS_URL,
  OTP_MAIL_ACCOUNT,
  APP_URL,
  APP_PORT,
  NODE_ENV,
  BACKEND_URL_1,
  BACKEND_URL_2,
});
