import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { CluesModule } from './clues/clues.module';
import { FieldsModule } from './fields/fields.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    CluesModule,
    FieldsModule,
    PrismaModule,
  ],
})
export class AppModule {}
