import {
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { configDotenv } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { expand as expandDotenv } from 'dotenv-expand';
import { UserEntity } from 'modules/user/entity/user.entity';
import { JwtPayload } from 'jsonwebtoken';

const env = configDotenv();
expandDotenv(env);

@Injectable()
export class CustomStrategy extends PassportStrategy(Strategy, 'custom') {
  constructor(private readonly config_service: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config_service.get('ACCESS_TOKEN_SECRET'),
    });
  }
  async validate(
    payload: JwtPayload & { device: string },
  ): Promise<UserEntity> {
    throw new NotImplementedException();
  }
}
