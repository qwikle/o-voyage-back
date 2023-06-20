import { GraphQLError } from 'graphql';

export class PermissionDeniedError extends GraphQLError {
  constructor(argumentName?: string) {
    super('Permission Denied', {
      extensions: {
        code: 'FORBIDDEN',
        argumentName,
      },
    });
  }
}
