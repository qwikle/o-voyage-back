import { GraphQLError } from 'graphql';

export class ScalarError extends GraphQLError {
  constructor(description: string ,argumentName?: string) {
    super(description, {
      extensions: {
        code: 'BAD_USER_INPUT',
        argumentName,
      },
    });
  }
}
