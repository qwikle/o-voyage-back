import { GraphQLError } from 'graphql';

export class UniqueError extends GraphQLError {
  constructor(argumentName: string) {
    super(`Cette ${argumentName} est déjà utilisée`, {
      extensions: {
        code: 'BAD_USER_INPUT',
        argumentName,
      },
    });
  }
}
