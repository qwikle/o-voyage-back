import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field()
  password: string;

  @Field()
  confirmPassword: string;

  @Field({ defaultValue: false })
  isBanned: boolean;

  @Field()
  role_id: string;
}
