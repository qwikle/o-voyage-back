import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { DataSource } from 'typeorm';
import { Reflector } from '@nestjs/core';
import { NotFoundError } from '../excepetions/notFound';

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
      throw new NotFoundError(`${entity} not found`);
    }
    ctx.getContext()[fieldName] = entityInstance;
    return true;
  }
}
