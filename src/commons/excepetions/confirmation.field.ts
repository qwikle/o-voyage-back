import { GraphQLError } from 'graphql';

export class ConfirmationFieldError extends GraphQLError {
  constructor(argumentName: string) {
    super(` ${argumentName}  does not match`, {
      extensions: {
        code: 'BAD_USER_INPUT',
        argumentName,
      },
    });
  }
}
