import { SetMetadata } from '@nestjs/common';

export const Property = (property: string) => SetMetadata('property', property);
