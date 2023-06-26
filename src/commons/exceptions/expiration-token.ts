import { GraphQLError } from 'graphql';

export class ExpirationTokenError extends GraphQLError {
  constructor(argumentName?: string) {
    super('Token expired', {
      extensions: {
        code: 'EXPIRATION_TOKEN',
        argumentName,
      },
    });
  }
}
