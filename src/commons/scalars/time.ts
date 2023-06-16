import { Scalar, CustomScalar } from '@nestjs/graphql';
import { GraphQLError, Kind, ValueNode } from 'graphql';

@Scalar('Time', () => String)
export class TimeScalar implements CustomScalar<string, string> {
  description = 'time in hours, minutes and seconds';

  private field = 'time';

  private validateTime(value: string): boolean {
    const timeRegex = new RegExp(/^([0-9]{2}):([0-9]{2}):([0-9]{2})$/);
    return timeRegex.test(value);
  }

  parseValue(value: string): string {
    if (!this.validateTime(value)) {
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
