import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PermissionDeniedError } from '../exceptions/denied';

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { auth } = ctx.getContext().req;
    if (auth.role !== Role.ADMIN) {
      throw new PermissionDeniedError();
    }
    return true;
  }
}

export enum Role {
  USER = 1,
  ADMIN = 2,
}
