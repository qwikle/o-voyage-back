import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/sign-up.Input';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SignInInput } from './dto/sign-in.input';
import { Hash } from 'src/commons/bcrypt';
import { OContext } from 'src/commons/types/context';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { UniqueError } from 'src/commons/exceptions/unique';
import { ConfirmationFieldError } from 'src/commons/exceptions/confirmation.field';
import { InvalidCredentialsError } from 'src/commons/exceptions/invalid.crendatials';
import { NotFoundError } from 'src/commons/exceptions/notFound';

// TODO set roles in new folder
@Resolver('Auth')
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly hash: Hash,
  ) {}

  @Mutation('signUp')
  async signUp(
    @Args('signUpInput') createAuthInput: SignUpInput,
    @Context() ctx: OContext,
  ) {
    const user = await this.authService.findByEmail(createAuthInput.email);
    if (user) {
      throw new UniqueError('email');
    }
    if (createAuthInput.password !== createAuthInput.confirmPassword) {
      throw new ConfirmationFieldError('confirmPassword');
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
      const isMatch = await this.hash.comparePassword(password, user.password);
      if (isMatch) {
        const token = await this.authService.generateToken(user, ctx.req.ip);
        return {
          user,
          token,
        };
      }
    }
    throw new InvalidCredentialsError();
  }

  @UseGuards(AuthGuard)
  @Mutation('deleteAccount')
  async deleteAccount(@Context() ctx: OContext) {
    const { auth } = ctx.req;
    const user = await this.authService.findById(auth.id);
    if (!user) {
      throw new NotFoundError();
    }
    return this.authService.deleteAccount(user);
  }

  @Mutation('refreshToken')
  async refreshToken(
    @Args('refreshToken') token: string,
    @Context() ctx: OContext,
  ) {
    try {
      const tokenPayload = await this.authService.verifyRefreshToken(token);
      const user = await this.authService.findById(tokenPayload.id);
      if (!user || user.isBanned) {
        throw new NotFoundError();
      }
      if (tokenPayload.ip !== ctx.req.ip) {
        throw new InvalidCredentialsError('Invalid token');
      }
      return this.authService.generateToken(user, ctx.req.ip);
    } catch (error) {
      throw new InvalidCredentialsError('Invalid token');
    }
  }
}
