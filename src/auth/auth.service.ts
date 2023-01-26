import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './auth.types';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SessionsService } from './sessions/sessions.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly sessionService: SessionsService,
  ) {}

  async validatePassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    const isValid = await bcrypt.compare(password, hashPassword);

    return isValid;
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await this.validatePassword(
      dto.password,
      user.hashPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const expiresIn = dto.trustMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

    const session = await this.sessionService.create({
      userId: user.id,
      expiresIn,
    });

    const jwtPayload: JwtPayload = {
      sessionId: session.id,
      userId: user.id,
    };

    const token = this.jwtService.sign(jwtPayload, {
      secret: this.configService.get('JWT_SECRET_KEY'),
      expiresIn,
    });

    return { token };
  }

  async getProfile(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async register(dto: RegisterDto) {
    return this.userService.create({
      username: dto.username,
      email: dto.email,
      password: dto.password,
    });
  }
}
