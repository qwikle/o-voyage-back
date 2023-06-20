import { SetMetadata } from '@nestjs/common';
import { PermissionProperty, TypeProperty } from '../types/guard';

export const Property = (permission: PermissionProperty, type: TypeProperty) =>
  SetMetadata('property', { permission, type });
