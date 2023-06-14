import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { DataSource } from 'typeorm';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ExistsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { fieldName } = ctx.getInfo();
    const { id } = ctx.getArgs();
    const entity = this.reflector.get<string>('entity', context.getHandler());
    const entityRepository = this.dataSource.getRepository(entity);
    const entityInstance = await entityRepository.findOneBy({ id });
    if (!entityInstance) {
      throw new GraphQLError(`${entity} not found`, {
        extensions: {
          code: 'NOT_FOUND',
          argumentName: 'id',
        },
      });
    }
    ctx.getContext()[fieldName] = entityInstance;
    return true;
  }
}
