import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { SessionsService } from './sessions.service';

@Module({
  providers: [SessionsService, PrismaService],
  exports: [SessionsService],
})
export class SessionsModule {}
