import { GraphQLError } from 'graphql';

export class InvalidCredentialsError extends GraphQLError {
  constructor(message?: string) {
    super(message ?? `Invalid credentials`, {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }
}
