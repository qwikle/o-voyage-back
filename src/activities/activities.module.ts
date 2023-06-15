import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesResolver } from './activities.resolver';
import { DataloaderService } from 'src/commons/dataloader/dataloader.service';

@Module({
  providers: [ActivitiesResolver, ActivitiesService, DataloaderService],
})
export class ActivitiesModule {}
