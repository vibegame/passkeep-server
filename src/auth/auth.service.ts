import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { Cookies } from './auth.constants';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SessionsService } from './sessions/sessions.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
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

  authorizeResponse(res: Response, data: { token: string }) {
    res.cookie(Cookies.TOKEN, data.token);
  }

  unauthorizeResponse(res: Response) {
    res.clearCookie(Cookies.TOKEN);
  }

  async unauthorize(res: Response) {
    this.unauthorizeResponse(res);
  }

  async authorize(dto: LoginDto, res: Response) {
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

    const session = await this.sessionService.create({
      userId: user.id,
      trust: dto.trustMe || false,
    });

    this.authorizeResponse(res, {
      token: session.token,
    });

    return session;
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
