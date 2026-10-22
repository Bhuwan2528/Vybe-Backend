import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PrismaService } from '../common/prisma/prisma.service.js';

export type AuthRole = 'USER' | 'ADMIN';

export interface AuthenticatedUser {
  id: string | number;
  name?: string | null;
  email: string;
  role: AuthRole;
}

interface JwtPayload {
  sub: string;
  email: string;
  role: AuthRole;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    if (!payload?.sub || !payload.email) {
      throw new UnauthorizedException('Invalid token');
    }

    // Admin database mein nahi hai; credentials .env mein hain.
    if (payload.role === 'ADMIN') {
      const adminEmail = this.configService
        .get<string>('ADMIN_EMAIL')
        ?.trim()
        .toLowerCase();

      if (
        !adminEmail ||
        payload.sub !== 'admin' ||
        payload.email.toLowerCase() !== adminEmail
      ) {
        throw new UnauthorizedException('Invalid admin token');
      }

      return {
        id: 'admin',
        email: adminEmail,
        role: 'ADMIN',
      };
    }

    if (payload.role !== 'USER') {
      throw new UnauthorizedException('Invalid token role');
    }

    // Normal user ko database se fetch karo.
    const user = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Deleted user ya mismatched identity ka token reject hoga.
    if (!user || String(user.id) !== payload.sub) {
      throw new UnauthorizedException('User not found');
    }

    // Passport is object ko request.user mein set karega.
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: 'USER',
    };
  }
}