import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { RequestUser } from '../auth.types';

export const User = createParamDecorator((_: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return request.user as RequestUser;
});
