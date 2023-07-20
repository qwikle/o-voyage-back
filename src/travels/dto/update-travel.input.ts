import { Field, InputType } from '@nestjs/graphql';
import { CreateTravelInput } from './create-travel.input';
import { PartialType } from '@nestjs/mapped-types';

@InputType()
export class UpdateTravelInput extends PartialType(CreateTravelInput) {
  @Field()
  id: number;
}
