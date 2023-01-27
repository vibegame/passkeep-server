import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import dayjs from 'src/helpers/dayjs';
import { PrismaService } from 'src/prisma/prisma.service';

import { Cookies } from '../auth.constants';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const request: Request = http.getRequest();
    const response: Response = http.getResponse();

    const token = request.cookies[Cookies.TOKEN];

    if (!token) {
      this.authService.unauthorizeResponse(response);
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
      this.authService.unauthorizeResponse(response);
      throw new UnauthorizedException();
    }

    // Check if session expires
    if (dayjs().valueOf() > session.expiresIn.valueOf()) {
      this.authService.unauthorizeResponse(response);
      throw new UnauthorizedException();
    }

    request.session = session;
    request.user = session.user;

    return true;
  }
}
