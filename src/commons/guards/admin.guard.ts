import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { auth } = ctx.getContext().req;
    if (auth.role !== Role.ADMIN) {
      throw new GraphQLError('Permission Denied', {
        extensions: {
          code: 'UNAUTHORIZED',
        },
      });
    }
    return true;
  }
}

export enum Role {
  USER = 1,
  ADMIN = 2,
}
