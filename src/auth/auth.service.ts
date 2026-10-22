import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { PrismaService } from '../common/prisma/prisma.service.js';
import { SignupDto } from './dto/signup.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // User signup
  async signup(dto: SignupDto) {
    const name = dto.name.trim();
    const email = dto.email.trim().toLowerCase();

    const adminEmail = this.configService
      .get<string>('ADMIN_EMAIL')
      ?.trim()
      .toLowerCase();

    if (adminEmail && email === adminEmail) {
      throw new ConflictException(
        'This email is reserved for the admin account',
      );
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(
        'An account with this email already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const accessToken = await this.createAccessToken(
      String(user.id),
      user.email,
      'USER',
    );

    return {
      message: 'Signup successful',
      accessToken,
      tokenType: 'Bearer',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'USER',
      },
    };
  }

  // Normal user login
  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (
      !user ||
      !(await bcrypt.compare(dto.password, user.password))
    ) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const accessToken = await this.createAccessToken(
      String(user.id),
      user.email,
      'USER',
    );

    return {
      message: 'Login successful',
      accessToken,
      tokenType: 'Bearer',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'USER',
      },
    };
  }

  // Admin login using plain-text credentials from .env
  async adminLogin(dto: LoginDto) {
    const adminEmail = this.configService
      .get<string>('ADMIN_EMAIL')
      ?.trim()
      .toLowerCase();

    const adminPassword =
      this.configService.get<string>('ADMIN_PASSWORD');

    if (!adminEmail || !adminPassword) {
      throw new InternalServerErrorException(
        'Admin credentials are not configured',
      );
    }

    const email = dto.email.trim().toLowerCase();

    if (
      email !== adminEmail ||
      dto.password !== adminPassword
    ) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const accessToken = await this.createAccessToken(
      'admin',
      adminEmail,
      'ADMIN',
    );

    return {
      message: 'Admin login successful',
      accessToken,
      tokenType: 'Bearer',
      user: {
        id: 'admin',
        email: adminEmail,
        role: 'ADMIN',
      },
    };
  }

  // Shared JWT creation
  private createAccessToken(
    sub: string,
    email: string,
    role: 'USER' | 'ADMIN',
  ) {
    return this.jwtService.signAsync({
      sub,
      email,
      role,
    });
  }
}