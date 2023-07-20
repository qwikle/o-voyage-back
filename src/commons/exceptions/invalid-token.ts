import { GraphQLError } from 'graphql';

export class InvalidTokenError extends GraphQLError {
  constructor() {
    super('Invalid token', {
      extensions: {
        code: 'INVALID_TOKEN',
      },
    });
  }
}
