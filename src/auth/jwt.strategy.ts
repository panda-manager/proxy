import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { configDotenv } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { expand as expandDotenv } from 'dotenv-expand';
import { UserEntity } from 'modules/user/entity/user.entity';
import { JwtPayload } from 'jsonwebtoken';
import { BackendsOrchestratorService } from '../modules/backends-orchestrator/backends_orchestrator.service';

const env = configDotenv();
expandDotenv(env);

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly backendsOrchestratorService: BackendsOrchestratorService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
    });
  }
  async validate(
    payload: JwtPayload & { device: string },
  ): Promise<UserEntity> {
    const { exp, sub } = payload;
    const found = await this.backendsOrchestratorService.makeRequest({
      data: { email: sub },
      url: '/user/find',
      method: 'GET',
    });

    if (!found || (exp && exp < Date.now() / 1000))
      throw new UnauthorizedException();

    return found;
  }
}
