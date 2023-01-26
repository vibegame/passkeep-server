import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../prisma/prisma.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [UsersModule, SessionsModule],
  providers: [AuthService, ConfigService, PrismaService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
