import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/auth/decorators/user.decorator';
import { SuccessResponse } from 'src/types/responses';
import { UsersSerializer } from 'src/users/users.serializer';

import { AuthService } from './auth.service';
import { RequestUser } from './auth.types';
import { Auth } from './decorators/auth.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto,
  ): Promise<SuccessResponse> {
    await this.authService.authorize(dto, res);

    return { success: true };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.authService.unauthorize(res);

    return { success: true };
  }

  @Auth()
  @Get('me')
  async getProfile(@User() requestUser: RequestUser) {
    const user = await this.authService.getProfile(requestUser.id);

    return user ? new UsersSerializer(user) : null;
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);

    return new UsersSerializer(user);
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto);

    return { success: true };
  }

  @Post('/reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto);

    return { success: true };
  }
}
