import { Scalar, CustomScalar } from '@nestjs/graphql';
import { GraphQLError, Kind, ValueNode } from 'graphql';

@Scalar('Date', () => Date)
export class DateScalar implements CustomScalar<string, Date> {
  description =
    'Date scalar type must be valid date string can be parsed by new Date() and accept timestamps with timezone eg: 2020-01-01T00:00:00+00:00';

  private field = 'date';

  private validateDate(value: string): boolean {
    const dateRegex = new RegExp(/^(\d{4})-(\d{2})-(\d{2})$/);
    return dateRegex.test(value);
  }

  parseValue(value: string): Date {
    if (!this.validateDate(value)) {
      throw new GraphQLError('');
    }
    return new Date(value);
  }

  serialize(value: Date): string {
    return value.toISOString().slice(0, 10);
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(this.description, {
        extensions: { argumenName: this.field },
      });
    }
    if (!this.validateDate(ast.value)) {
      throw new GraphQLError(this.description, {
        extensions: { argumenName: this.field },
      });
    }
    return new Date(ast.value);
  }
}
