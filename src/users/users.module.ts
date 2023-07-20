import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PasswordScalar } from '../commons/scalars/password';
import { EmailScalar } from 'src/commons/scalars/email';
import { Role } from './entities/role.entity';
import { Hash } from 'src/commons/bcrypt';
import { DataloaderService } from 'src/commons/dataloader/dataloader.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [
    UsersResolver,
    UsersService,
    DataloaderService,
    PasswordScalar,
    EmailScalar,
    Hash,
  ],
})
export class UsersModule {}
