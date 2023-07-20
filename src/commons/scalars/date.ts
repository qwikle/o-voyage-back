import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import { ScalarError } from '../exceptions/scalar-exception';

@Scalar('Date', () => Date)
export class DateScalar implements CustomScalar<string, Date> {
  description =
    'Date scalar type must be valid date string, example : "2023-01-01"';

  private field = 'date';

  private validateDate(value: string): boolean {
    const dateRegex = new RegExp(/^(\d{4})-(\d{2})-(\d{2})$/);
    return dateRegex.test(value);
  }

  parseValue(value: string): Date {
    if (!this.validateDate(value)) {
      throw new ScalarError(this.description, this.field);
    }
    return new Date(value);
  }

  serialize(value: Date): string {
    return new Date(value).toISOString().slice(0, 10);
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind !== Kind.STRING) {
      throw new ScalarError(this.description, this.field);
    }
    if (!this.validateDate(ast.value)) {
      throw new ScalarError(this.description, this.field);
    }
    return new Date(ast.value);
  }
}
