import { GraphQLError } from 'graphql';

export class UniqueError extends GraphQLError {
  constructor(argumentName: string) {
    super(`This ${argumentName}  is allready used`, {
      extensions: {
        code: 'BAD_USER_INPUT',
        argumentName,
      },
    });
  }
}
