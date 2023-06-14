import { Scalar, CustomScalar } from '@nestjs/graphql';
import { GraphQLError, Kind, ValueNode } from 'graphql';

@Scalar('Email', () => String)
export class EmailScalar implements CustomScalar<string, string> {
  description = 'Email must be valid email address';

  private field = 'email';

  private validateEmail(value: string): boolean {
    const emailRegex = new RegExp(
      /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/,
    );
    return emailRegex.test(value);
  }

  parseValue(value: string): string {
    if (!this.validateEmail(value)) {
      throw new GraphQLError('');
    }
    return value.toLowerCase();
  }

  serialize(value: string): string {
    return value;
  }

  parseLiteral(ast: ValueNode): string {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(this.description, {
        extensions: { argumenName: this.field },
      });
    }
    return ast.value.toLowerCase();
  }
}
