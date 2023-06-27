import { Field, InputType } from '@nestjs/graphql';
import { PartialType } from '@nestjs/mapped-types';
import { SignInInput } from './sign-in.input';

@InputType()
export class UpdateAccountInput extends PartialType(SignInInput) {
}
