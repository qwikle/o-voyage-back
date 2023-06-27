import { Field, InputType } from '@nestjs/graphql';
import { PartialType } from '@nestjs/mapped-types';
import { SignUpInput } from './sign-up.Input';

@InputType()
export class UpdateAccountInput extends PartialType(SignUpInput) {}
