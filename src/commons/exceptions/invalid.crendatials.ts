import { GraphQLError } from 'graphql';

export class InvalidCredentialsError extends GraphQLError {
  constructor(message?: string) {
    super(message ?? `Les informations saisies sont invalides`, {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }
}
