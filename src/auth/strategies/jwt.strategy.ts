import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    if (!process.env.JWT_ACCESS_SECRET) {
      throw new Error('JWT_ACCESS_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  validate(payload: {
    sub: string;
    organizationId: string | null;
    role: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
  }) {
    return {
      userId: payload.sub,
      organizationId: payload.organizationId,
      role: payload.role,
    };
  }
}
