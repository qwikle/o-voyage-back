import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { Role } from './admin.guard';
import { DataSource } from 'typeorm';
import { PermissionDeniedError } from '../exceptions/denied';
import { JwtPayload } from '../types/context';
import {
  PermissionProperty,
  PropertyMetadata,
  TravelIdInterface,
  TypeProperty,
} from '../types/guard';

@Injectable()
export class AllowedGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { auth } = ctx.getContext().req as { auth: JwtPayload };
    const property = this.reflector.get<PropertyMetadata>(
      'property',
      context.getHandler(),
    );
    const { id } = ctx.getArgs();
    if (auth.role !== Role.ADMIN) {
      const { permission, type } = property;
      const ids = await this.getEntityRow(id, type);
      await this.checkPermission(auth, permission, ids);
    }
    return true;
  }

  private async getEntityRow(id: number, entity: TypeProperty) {
    if (entity === (TypeProperty.ACTIVITY || TypeProperty.PICTURE)) {
      const result = await this.dataSource.manager
        .getRepository(entity)
        .findOne({
          where: {
            id,
          },
          relations: ['travel'],
        });
      return {
        travelId: result.travel.id,
        organizerId: result.travel.organizerId,
      } as TravelIdInterface;
    }
    if (entity === TypeProperty.TRAVEL) {
      const result = await this.dataSource.manager
        .getRepository(entity)
        .findOne({
          where: {
            id,
          },
        });
      return {
        organizerId: result.organizerId,
        travelId: result.id,
      } as TravelIdInterface;
    }
  }

  private checkPermission(
    auth: JwtPayload,
    permission: PermissionProperty,
    ids: TravelIdInterface,
  ) {
    if (permission === PermissionProperty.TRAVELER) {
      return this.getTraveler(auth.id, ids.travelId);
    }
    if (permission === PermissionProperty.ORGANIZER) {
      if (auth.id !== ids.organizerId) {
        throw new PermissionDeniedError();
      }
    }
  }

  private async getTraveler(id: number, travelId: number) {
    const result = await this.dataSource.query(
      `
    SELECT * FROM get_one_traveler($1, $2)
    `,
      [id, travelId],
    );
    if (result.length === 0) {
      throw new PermissionDeniedError();
    }
  }
}
