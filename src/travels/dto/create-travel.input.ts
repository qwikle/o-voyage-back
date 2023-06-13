import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTravelInput {
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

  @Field()
  organizerId: number;
}
