import { Module } from '@nestjs/common';

import { CluesController } from './clues.controller';
import { CluesService } from './clues.service';

@Module({
  controllers: [CluesController],
  providers: [CluesService],
  exports: [CluesService],
})
export class CluesModule {}
