import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ActivitiesService } from './activities.service';
import { CreateActivityInput } from './dto/create-activity.input';
import { UpdateActivityInput } from './dto/update-activity.input';
import { DataloaderService } from 'src/commons/dataloader/dataloader.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ExistsGuard } from 'src/commons/guards/exists.guard';
import {
  AllowedGuard,
  PermissionProperty,
  TypeProperty,
} from 'src/commons/guards/allowed.guard';
import { Entity } from 'src/commons/guards/Entity.decorator';
import { Activity } from './entities/activity.entity';
import { Property } from 'src/commons/guards/Property.decorator';

@Resolver('Activity')
export class ActivitiesResolver {
  constructor(
    private readonly activitiesService: ActivitiesService,
    private readonly dataloaderService: DataloaderService,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation('createActivity')
  create(
    @Args('createActivityInput') createActivityInput: CreateActivityInput,
  ) {
    // TODO check if user is organizer of the travel
    return this.activitiesService.create(createActivityInput);
  }

  // TODO REMOVE THIS FUNCTION
  @Query('activities')
  findAll() {
    return this.activitiesService.findAll();
  }

  // TODO REMOVE THIS FUNCTION
  @Query('activity')
  findOne(@Args('id') id: number) {
    return this.dataloaderService.getByActivity().load(id);
  }

  @UseGuards(AuthGuard)
  @Query('activitiesByDate')
  findByDate(@Args('date') date: Date, @Args('travelId') travelId: number) {
    return this.activitiesService.findByDate(date, travelId);
  }

  @UseGuards(AuthGuard, ExistsGuard, AllowedGuard)
  @Entity('Activity')
  @Property(PermissionProperty.ORGANIZER, TypeProperty.ACTIVITY)
  @Mutation('updateActivity')
  update(
    @Args('updateActivityInput') updateActivityInput: UpdateActivityInput,
    @Context('updateActivity') activity: Activity,
  ) {
    return this.activitiesService.update(activity, updateActivityInput);
  }

  @UseGuards(AuthGuard, ExistsGuard, AllowedGuard)
  @Entity('Activity')
  @Property(PermissionProperty.ORGANIZER, TypeProperty.ACTIVITY)
  @Mutation('removeActivity')
  remove(@Args('id') id: number) {
    return this.activitiesService.remove(id);
  }
}
