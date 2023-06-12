import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/sign-up.Input';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SignInInput } from './dto/sign-in.input';
import { Hash } from 'src/commons/bcrypt';
import { GraphQLError } from 'graphql';
import { OContext } from 'src/commons/context';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

// TODO set roles in new folder
@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation('signUp')
  async signUp(
    @Args('signUpInput') createAuthInput: SignUpInput,
    @Context() ctx: OContext,
  ) {
    const user = await this.authService.findByEmail(createAuthInput.email);
    if (user) {
      throw new GraphQLError('This email is allready used', {
        extensions: {
          code: 'BAD_USER_INPUT',
          argumentName: 'email',
        },
      });
    }
    if (createAuthInput.password !== createAuthInput.confirmPassword) {
      throw new GraphQLError('Password and confirm password are not the same', {
        extensions: {
          code: 'BAD_USER_INPUT',
          argumentName: 'confirmPassword',
        },
      });
    }
    const createdUser = await this.authService.createUser(createAuthInput);
    const token = await this.authService.generateToken(createdUser, ctx.req.ip);
    return { user: createdUser, token };
  }

  @Mutation('signIn')
  async signIn(
    @Args('signInInput') SignInInput: SignInInput,
    @Context() ctx: OContext,
  ) {
    const { password, email } = SignInInput;
    const user = await this.authService.findByEmail(email);
    if (user) {
      const isMatch = await Hash.getInstance().comparePassword(
        password,
        user.password,
      );
      if (isMatch) {
        const { ip } = ctx.req;
        const token = await this.authService.generateToken(user, ip);
        return {
          user,
          token,
        };
      }
    }
    throw new GraphQLError('Invalid credentials', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }

  @UseGuards(AuthGuard)
  @Mutation('deleteAccount')
  async deleteAccount(@Context() ctx: OContext) {
    const { auth } = ctx.req;
    const user = await this.authService.findById(auth.id);
    if (!user) {
      throw new GraphQLError('User not found', {
        extensions: {
          code: 'NOT_FOUND',
        },
      });
    }
    return this.authService.deleteAccount(user);
  }
}
