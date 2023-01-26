import { Injectable, NotFoundException } from '@nestjs/common';
import { Field } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

import { UpdateFieldDto } from './dto/update-field.dto';

@Injectable()
export class FieldsService {
  constructor(private readonly prisma: PrismaService) {}

  async update(
    userId: string,
    id: string,
    dto: UpdateFieldDto,
  ): Promise<Field> {
    const foundField = await this.prisma.field.findFirst({
      where: {
        id,
        clue: {
          userId,
        },
      },
    });

    if (!foundField) {
      throw new NotFoundException();
    }

    const updatedField = await this.prisma.field.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
        value: dto.value,
      },
    });

    return updatedField;
  }

  async delete(userId: string, id: string) {
    const foundField = await this.prisma.field.findFirst({
      where: {
        id,
        clue: {
          userId,
        },
      },
    });

    if (!foundField) {
      throw new NotFoundException();
    }

    await this.prisma.field.delete({
      where: { id },
    });
  }
}
