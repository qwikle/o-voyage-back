import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { LoaderService } from 'src/commons/dataloader';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PasswordScalar } from '../commons/scalars/password';
import { EmailScalar } from 'src/commons/scalars/email';
import { Role } from './entities/role.entity';
import { Hash } from 'src/commons/bcrypt';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [
    UsersResolver,
    UsersService,
    LoaderService,
    PasswordScalar,
    EmailScalar,
    Hash,
  ],
})
export class UsersModule {}
