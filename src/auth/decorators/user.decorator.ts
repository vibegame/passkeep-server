import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const User = createParamDecorator((_: any, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();

  return request.user;
});
