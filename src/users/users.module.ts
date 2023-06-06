import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { LoaderService } from 'src/commons/dataloader';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PasswordScalar } from '../scalars/password';
import { EmailScalar } from 'src/scalars/email';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersResolver,
    UsersService,
    LoaderService,
    PasswordScalar,
    EmailScalar,
  ],
})
export class UsersModule {}
