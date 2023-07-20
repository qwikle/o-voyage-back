import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import { ScalarError } from '../exceptions/scalar-exception';

@Scalar('Time', () => String)
export class TimeScalar implements CustomScalar<string, string> {
  description = 'time must be in hours, minutes and seconds';

  private field = 'time';

  private validateTime(value: string): boolean {
    const timeRegex = new RegExp(/^([0-9]{2}):([0-9]{2}):([0-9]{2})$/);
    return timeRegex.test(value);
  }

  parseValue(value: string): string {
    if (!this.validateTime(value)) {
      throw new ScalarError(this.description, this.field);
    }
    return value.toLowerCase();
  }

  serialize(value: string): string {
    return value;
  }

  parseLiteral(ast: ValueNode): string {
    if (ast.kind !== Kind.STRING) {
      throw new ScalarError(this.description, this.field);
    }
    return ast.value.toLowerCase();
  }
}
