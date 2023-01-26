import { Controller, Get, NotFoundException, Param } from '@nestjs/common';

import { UsersSerializer } from './users.serializer';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UsersSerializer> {
    const user = await this.usersService.getUserById(id);

    if (!user) {
      throw new NotFoundException();
    }

    return new UsersSerializer(user);
  }
}
