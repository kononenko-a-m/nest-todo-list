import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.model';
import { JwtPayload } from './jwt-payload';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('authorization.jwt.secret'),
    });
  }

  async validate({ userId }: JwtPayload): Promise<User> {
    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
