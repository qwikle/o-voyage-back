import { Field, InputType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class CreateUserInput extends User {
  @Field()
  email: string;

  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field()
  password: string;

  @Field()
  isBanned: boolean;

  @Field()
  role_id: string;
}
