import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignUpInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  confirmPassword: string;

  @Field()
  firstname: string;

  @Field()
  lastname: string;
}
