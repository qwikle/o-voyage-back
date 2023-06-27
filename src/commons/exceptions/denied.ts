import { GraphQLError } from 'graphql';

export class PermissionDeniedError extends GraphQLError {
  constructor(argumentName?: string) {
    super(`Vous n'êtes pas autorisé à effectuer cette action`, {
      extensions: {
        code: 'FORBIDDEN',
        argumentName,
      },
    });
  }
}
