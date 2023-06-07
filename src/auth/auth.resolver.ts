import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/sign-up.Input';
import { SignInInput } from './dto/sign-in.input';
import { Hash } from 'src/commons/bcrypt';
import { GraphQLError } from 'graphql';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation('signUp')
  signUp(@Args('signUp') createAuthInput: SignUpInput) {
    return this.authService.createUser(createAuthInput);
  }

  @Mutation('signIn')
  async signIn(@Args('signIn') SignInInput: SignInInput) {
    const { password, email } = SignInInput;
    const user = await this.authService.findByEmail(email);
    if (user) {
      const isMatch = Hash.getInstance().comparePassword(
        password,
        user.password,
      );
      if (isMatch) {
        const token = await this.authService.generateToken(user);
        return {
          user,
          token,
        };
      }
    }
    throw new GraphQLError('Invalid credentials');
  }
}
