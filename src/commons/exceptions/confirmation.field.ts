import { GraphQLError } from 'graphql';

export class ConfirmationFieldError extends GraphQLError {
  constructor(argumentName: string) {
    super(` ${argumentName} ne correspond pas`, {
      extensions: {
        code: 'BAD_USER_INPUT',
        argumentName,
      },
    });
  }
}
