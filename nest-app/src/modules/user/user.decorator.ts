import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserInfo } from './user.interface';

export const UserDC = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as UserInfo;
    return !!data ? user?.[data] : user;
  },
);
