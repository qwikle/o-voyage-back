import { Scalar, CustomScalar } from '@nestjs/graphql';
import { ScalarError } from '../exceptions/scalar-exception';

@Scalar('Password', () => String)
export class PasswordScalar implements CustomScalar<string, string> {
  private field = 'password';
  description =
    'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number .';

  private validate(value: string): boolean {
    const regex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})');
    return regex.test(value);
  }

  parseValue(value: string): string {
    if (!this.validate(value)) {
      throw new ScalarError(this.description, this.field);
    }

    return value;
  }

  serialize(value: string): string {
    return value;
  }

  parseLiteral(ast: any): string {
    if (!this.validate(ast.value)) {
      throw new ScalarError(this.description, this.field);
    }

    return ast.value;
  }
}
