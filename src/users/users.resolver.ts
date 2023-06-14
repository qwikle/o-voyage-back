import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { GraphQLError } from 'graphql';
import { UseGuards } from '@nestjs/common';
import { ExistsGuard } from 'src/commons/guards/exists.guard';
import { Entity } from 'src/commons/guards/Entity.decorator';
import { User } from './entities/user.entity';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation('createUser')
  async create(@Args('createUserInput') createUserInput: CreateUserInput) {
    const user = await this.usersService.findByEmail(createUserInput.email);
    if (user) {
      throw new GraphQLError('This email is allready used', {
        extensions: {
          code: 'BAD_USER_INPUT',
          argumentName: 'email',
        },
      });
    }
    if (createUserInput.password !== createUserInput.confirmPassword) {
      throw new GraphQLError('Password and confirm password are not the same', {
        extensions: {
          code: 'BAD_USER_INPUT',
          argumentName: 'confirmPassword',
        },
      });
    }
    return this.usersService.createUser(createUserInput);
  }

  @Query('users')
  findAll() {
    return this.usersService.findAll();
  }

  @Query('user')
  findOne(@Args('id') id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(ExistsGuard)
  @Entity('User')
  @Mutation('updateUser')
  update(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @Context('updateUser') user: User,
  ) {
    return this.usersService.update(user, updateUserInput);
  }

  @UseGuards(ExistsGuard)
  @Entity('User')
  @Mutation('removeUser')
  remove(@Args('id') id: number) {
    return this.usersService.remove(id);
  }
}
