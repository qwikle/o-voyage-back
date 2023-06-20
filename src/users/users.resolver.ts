import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { ExistsGuard } from 'src/commons/guards/exists.guard';
import { Entity } from 'src/commons/guards/Entity.decorator';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/commons/guards/admin.guard';
import { DataloaderService } from 'src/commons/dataloader/dataloader.service';
import { DataLoaderInterface } from 'src/commons/types/dataloader';
import { UniqueError } from 'src/commons/exceptions/unique';
import { ConfirmationFieldError } from 'src/commons/exceptions/confirmation.field';

@Resolver('User')
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private dataLoaderService: DataloaderService,
  ) {}

  @UseGuards(AuthGuard, AdminGuard)
  @Mutation('createUser')
  async create(@Args('createUserInput') createUserInput: CreateUserInput) {
    const user = await this.usersService.findByEmail(createUserInput.email);
    if (user) {
      throw new UniqueError('email');
    }
    if (createUserInput.password !== createUserInput.confirmPassword) {
      throw new ConfirmationFieldError('confirmPassword');
    }
    return this.usersService.createUser(createUserInput);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Query('users')
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Query('user')
  findOne(
    @Args('id') id: number,
    @Context('dataloader') dataloader: DataLoaderInterface,
  ) {
    return dataloader.getByUser().one.load(id);
  }

  @UseGuards(AuthGuard, AdminGuard, ExistsGuard)
  @Entity('User')
  @Mutation('updateUser')
  update(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @Context('updateUser') user: User,
  ) {
    return this.usersService.update(user, updateUserInput);
  }

  @UseGuards(AuthGuard, AdminGuard, ExistsGuard)
  @Entity('User')
  @Mutation('removeUser')
  remove(@Args('id') id: number) {
    return this.usersService.remove(id);
  }

  @ResolveField('role')
  role(
    @Parent() user: User,
    @Context('dataloader') dataloader: DataLoaderInterface,
  ) {
    return dataloader.getByRole().one.load(user.roleId);
  }

  @ResolveField('travels')
  travels(
    @Parent() user: User,
    @Context('dataloader') dataloader: DataLoaderInterface,
  ) {
    return dataloader.getTravels().load(user.id);
  }
}
