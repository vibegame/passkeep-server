import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CluesController } from './clues.controller';
import { CluesService } from './clues.service';

@Module({
  controllers: [CluesController],
  providers: [CluesService, PrismaService],
  exports: [CluesService],
})
export class CluesModule {}
