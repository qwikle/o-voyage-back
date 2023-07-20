import { GraphQLError } from 'graphql';

export class NotFoundError extends GraphQLError {
  constructor(argumentName?: string) {
    super('Not Found', {
      extensions: {
        code: 'NOT_FOUND',
        argumentName,
      },
    });
  }
}
