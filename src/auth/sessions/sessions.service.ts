import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ userId, expiresIn }: { userId: string; expiresIn: number }) {
    const session = await this.prisma.session.create({
      data: {
        userId,
        token: crypto.randomBytes(64).toString('hex'),
        expiresIn: dayjs().add(expiresIn, 'milliseconds').toDate(),
      },
    });

    return session;
  }
}
