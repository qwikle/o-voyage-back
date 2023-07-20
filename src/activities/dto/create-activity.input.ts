import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateActivityInput {
  @Field()
  name: string;

  @Field()
  price: number;

  @Field()
  location: string;

  @Field()
  members: number;

  @Field()
  time: string;

  @Field()
  date: Date;

  @Field()
  travelId: number;

  @Field()
  categoryId: number;
}
