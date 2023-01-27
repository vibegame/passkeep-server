import { Injectable } from '@nestjs/common';
import { Clue, Field } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateClueDto } from './dto/create-clue.dto';
import { UpdateClueDto } from './dto/update-clue.dto';

@Injectable()
export class CluesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string): Promise<(Clue & { fields: Field[] })[]> {
    return this.prisma.clue.findMany({
      where: {
        userId,
      },
      include: {
        fields: true,
      },
    });
  }

  async create(
    userId: string,
    dto: CreateClueDto,
  ): Promise<Clue & { fields: Field[] }> {
    const clue = await this.prisma.clue.create({
      data: {
        name: dto.name,
        userId,
        fields: {
          createMany: {
            data: dto.fields,
          },
        },
      },
      include: {
        fields: true,
      },
    });

    return clue;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateClueDto,
  ): Promise<Clue | null> {
    const foundClue = await this.prisma.clue.findFirst({
      where: { id, userId },
    });

    if (!foundClue) {
      return null;
    }

    return await this.prisma.clue.update({
      where: { id: foundClue.id },
      data: { name: dto.name },
    });
  }

  async delete(userId: string, id: string): Promise<true | null> {
    const foundClue = await this.prisma.clue.findFirst({
      where: { id, userId },
    });

    if (!foundClue) {
      return null;
    }

    await this.prisma.$transaction([
      this.prisma.clue.delete({
        where: {
          id: foundClue.id,
        },
      }),
    ]);

    return true;
  }
}
