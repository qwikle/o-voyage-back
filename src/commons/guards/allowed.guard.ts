import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { Reflector } from '@nestjs/core';
import { Role } from './admin.guard';

@Injectable()
export class AllowedGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { fieldName } = ctx.getInfo();
    const { auth } = ctx.getContext().req;
    const property = this.reflector.get<string>(
      'property',
      context.getHandler(),
    );
    const entityInstance = ctx.getContext()[fieldName];
    if (entityInstance[property] !== auth.id) {
      if (auth.role !== Role.ADMIN)
        throw new GraphQLError(`Permission Denied`, {
          extensions: {
            code: 'FORBIDDEN',
          },
        });
    }
    return true;
  }
}
