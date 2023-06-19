import { SetMetadata } from '@nestjs/common';
import { PermissionProperty, TypeProperty } from './allowed.guard';

export const Property = (permission: PermissionProperty, type: TypeProperty) =>
  SetMetadata('property', { permission, type });

export interface PropertyMetadata {
  permission: PermissionProperty;
  type: TypeProperty;
}
