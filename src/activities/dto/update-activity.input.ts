import { Field } from '@nestjs/graphql';
import { CreateActivityInput } from './create-activity.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateActivityInput extends PartialType(CreateActivityInput) {
  @Field()
  id: number;
}
