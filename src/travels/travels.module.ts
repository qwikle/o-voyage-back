import { Module } from '@nestjs/common';
import { TravelsService } from './travels.service';
import { TravelsResolver } from './travels.resolver';
import { DateScalar } from 'src/commons/scalars/date';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { User } from 'src/users/entities/user.entity';
import { DataloaderService } from 'src/commons/dataloader/dataloader.service';
import { Hash } from 'src/commons/bcrypt';
import { ActivitiesService } from 'src/activities/activities.service';
import { Activity } from 'src/activities/entities/activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Travel, User, Activity])],
  providers: [
    TravelsResolver,
    TravelsService,
    DateScalar,
    DataloaderService,
    ActivitiesService,
    Hash,
  ],
})
export class TravelsModule {}
