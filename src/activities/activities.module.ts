import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesResolver } from './activities.resolver';
import { DateScalar } from 'src/commons/scalars/date';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from '../travels/entities/travel.entity';
import { User } from '../users/entities/user.entity';
import { TimeScalar } from 'src/commons/scalars/time';
import { Activity } from './entities/activity.entity';
import { DataloaderService } from 'src/commons/dataloader/dataloader.service';

@Module({
  imports: [TypeOrmModule.forFeature([Travel, User, Activity])],
  providers: [
    ActivitiesResolver,
    ActivitiesService,
    DateScalar,
    TimeScalar,
    DataloaderService,
  ],
})
export class ActivitiesModule {}
