import { Module } from '@nestjs/common';
import { TravelsService } from './travels.service';
import { TravelsResolver } from './travels.resolver';
import { DateScalar } from 'src/commons/scalars/date';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { User } from 'src/users/entities/user.entity';
import { DataloaderService } from 'src/commons/dataloader/dataloader.service';
import { Hash } from 'src/commons/bcrypt';

@Module({
  imports: [TypeOrmModule.forFeature([Travel, User])],
  providers: [
    TravelsResolver,
    TravelsService,
    DateScalar,
    DataloaderService,
    Hash,
  ],
})
export class TravelsModule {}
