import { GraphQLError } from 'graphql';

export class INTERNAL_SERVER_ERROR extends GraphQLError {
  constructor(argumentName?: string) {
    super(`Une erreur serveur est survenue.`, {
      extensions: {
        code: '"INTERNAL_SERVER_ERROR"',
        argumentName
      },
    });
  }
}
