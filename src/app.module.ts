import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { CluesModule } from './clues/clues.module';
import { FieldsModule } from './fields/fields.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    CluesModule,
    FieldsModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
