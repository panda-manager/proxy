import { NODE_ENV } from '../../../environments';

const auth_token_config = {
  development: {},
  production: {
    expiresIn: '3000h',
  },
};

export default auth_token_config[NODE_ENV];
