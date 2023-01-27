import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllUserSessions(userId: string) {
    return this.prisma.session.findMany({
      where: {
        userId,
      },
    });
  }

  async expireAllUserSessions(userId: string) {
    return this.prisma.session.updateMany({
      where: { userId },
      data: {
        expiresIn: new Date(),
      },
    });
  }

  async expireSession(id: string) {
    return this.prisma.session.update({
      where: { id },
      data: {
        expiresIn: new Date(),
      },
    });
  }

  async create({ userId, trust }: { userId: string; trust: boolean }) {
    const today = dayjs();
    const expiresIn = trust ? today.add(1, 'month') : today.add(1, 'hour');

    const session = await this.prisma.session.create({
      data: {
        userId,
        token: crypto.randomBytes(64).toString('hex'),
        expiresIn: expiresIn.toDate(),
      },
    });

    return session;
  }
}
