import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RequestUser } from 'src/auth/auth.types';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';

import { SuccessResponse } from '../types/responses';
import { CluesSerializer } from './clues.serializer';
import { CluesService } from './clues.service';
import { CreateClueDto } from './dto/create-clue.dto';
import { UpdateClueDto } from './dto/update-clue.dto';

@Controller('clues')
export class CluesController {
  constructor(private readonly cluesService: CluesService) {}

  @Auth()
  @Get()
  async findAll(@User() user: RequestUser): Promise<CluesSerializer[]> {
    return (await this.cluesService.findAll(user.id)).map(
      CluesSerializer.factory,
    );
  }

  @Auth()
  @Post()
  async create(
    @User() user: RequestUser,
    @Body() dto: CreateClueDto,
  ): Promise<CluesSerializer> {
    const clue = await this.cluesService.create(user.id, dto);

    return new CluesSerializer(clue);
  }

  @Auth()
  @Put(':id')
  async update(
    @User() user: RequestUser,
    @Body() dto: UpdateClueDto,
    @Param('id') id: string,
  ): Promise<CluesSerializer> {
    const clue = await this.cluesService.update(user.id, id, dto);

    if (!clue) {
      throw new NotFoundException();
    }

    return new CluesSerializer(clue);
  }

  @Auth()
  @Delete(':id')
  async delete(
    @User() user: RequestUser,
    @Param('id') id: string,
  ): Promise<SuccessResponse> {
    const result = await this.cluesService.delete(user.id, id);

    if (!result) {
      throw new NotFoundException();
    }

    return { success: true };
  }
}
