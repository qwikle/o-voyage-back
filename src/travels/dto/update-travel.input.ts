import { CreateTravelInput } from './create-travel.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateTravelInput extends PartialType(CreateTravelInput) {
  id: number;
}
