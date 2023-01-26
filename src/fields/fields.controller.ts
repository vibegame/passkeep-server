import { Body, Controller, Delete, Param, Put } from '@nestjs/common';
import { RequestUser } from 'src/auth/auth.types';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { SuccessResponse } from 'src/types/responses';

import { UpdateFieldDto } from './dto/update-field.dto';
import { FieldsSerializer } from './fields.serializer';
import { FieldsService } from './fields.service';

@Controller('fields')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Auth()
  @Put(':id')
  async update(
    @User() user: RequestUser,
    @Body() dto: UpdateFieldDto,
    @Param('id') id: string,
  ) {
    const field = await this.fieldsService.update(user.id, id, dto);

    return new FieldsSerializer(field);
  }

  @Auth()
  @Delete(':id')
  async delete(
    @User() user: RequestUser,
    @Param('id') id: string,
  ): Promise<SuccessResponse> {
    await this.fieldsService.delete(user.id, id);

    return { success: true };
  }
}
