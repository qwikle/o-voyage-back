import { CreateAuthInput } from './signUpInput';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateAuthInput extends PartialType(CreateAuthInput) {
  id: number;
}
