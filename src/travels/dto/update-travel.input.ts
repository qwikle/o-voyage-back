import { Field, InputType } from '@nestjs/graphql';
import { CreateTravelInput } from './create-travel.input';
import { PartialType } from '@nestjs/mapped-types';

@InputType()
export class UpdateTravelInput extends PartialType(CreateTravelInput) {
  id: number;

  @Field()
  title: string;

  @Field()
  from: string;

  @Field()
  to: string;

  @Field()
  departureDate: Date;

  @Field()
  arrivalDate: Date;

  @Field()
  budget: number;

  @Field()
  numberOfAttendees: number;
}
