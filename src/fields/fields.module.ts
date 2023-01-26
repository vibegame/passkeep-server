import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { FieldsController } from './fields.controller';
import { FieldsService } from './fields.service';

@Module({
  providers: [FieldsService, PrismaService],
  controllers: [FieldsController],
  exports: [PrismaService],
})
export class FieldsModule {}
