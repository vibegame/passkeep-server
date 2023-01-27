import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Response } from 'express';
import dayjs from 'src/helpers/dayjs';

import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { Cookies } from './auth.constants';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SessionsService } from './sessions/sessions.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
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

  async getProfile(id: string) {
    return this.usersService.getUserById(id);
  }

  async register(dto: RegisterDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        username: dto.username,
        OR: {
          email: dto.email,
        },
      },
    });

    if (user) {
      throw new BadRequestException('User exists');
    }

    return this.usersService.create({
      username: dto.username,
      email: dto.email,
      password: dto.password,
    });
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      return;
    }

    const token = crypto.randomBytes(64).toString('hex');

    await this.prisma.resetPassword.create({
      data: {
        token,
        userId: user.id,
        expiresIn: dayjs().add(1, 'day').toDate(),
      },
    });

    // send email with link with token
  }

  async resetPassword(dto: ResetPasswordDto) {
    const resetPasswordEntity = await this.prisma.resetPassword.findUnique({
      where: { token: dto.token },
    });

    if (!resetPasswordEntity) {
      throw new BadRequestException();
    }

    if (dayjs().valueOf() > resetPasswordEntity.expiresIn.valueOf()) {
      throw new BadRequestException();
    }

    const hashPassword = await this.usersService.getHashPassword(
      dto.newPassword,
    );

    await this.sessionService.expireAllUserSessions(resetPasswordEntity.userId);

    // Change password
    await this.prisma.user.update({
      where: {
        id: resetPasswordEntity.userId,
      },
      data: {
        hashPassword,
      },
    });

    // Delete reset password entity
    await this.prisma.resetPassword.delete({
      where: {
        id: resetPasswordEntity.id,
      },
    });

    return true;
  }
}
