import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import dayjs from 'src/helpers/dayjs';
import { PrismaService } from 'src/prisma/prisma.service';

import { Cookies } from '../auth.constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const request: Request = http.getRequest();

    const token = request.cookies[Cookies.TOKEN];

    if (!token) {
      throw new UnauthorizedException();
    }

    const session = await this.prisma.session.findUnique({
      where: {
        token,
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      throw new UnauthorizedException();
    }

    if (dayjs().valueOf() > session.expiresIn.valueOf()) {
      throw new UnauthorizedException();
    }

    request.session = session;
    request.user = session.user;

    return true;
  }
}
