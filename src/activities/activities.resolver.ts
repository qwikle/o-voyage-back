import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ActivitiesService } from './activities.service';
import { CreateActivityInput } from './dto/create-activity.input';
import { UpdateActivityInput } from './dto/update-activity.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ExistsGuard } from 'src/commons/guards/exists.guard';
import { AllowedGuard } from 'src/commons/guards/allowed.guard';
import { Entity } from 'src/commons/guards/Entity.decorator';
import { Activity } from './entities/activity.entity';
import { Property } from 'src/commons/guards/Property.decorator';
import { PermissionProperty, TypeProperty } from 'src/commons/types/guard';
import { DataLoaderInterface } from 'src/commons/types/dataloader';
import { PermissionDeniedError } from 'src/commons/exceptions/denied';

@Resolver('Activity')
export class ActivitiesResolver {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @UseGuards(AuthGuard)
  @Mutation('createActivity')
  async create(
    @Args('createActivityInput') createActivityInput: CreateActivityInput,
    @Context('req') { auth },
  ) {
    const traveler = await this.activitiesService.getTraveler(
      auth.id,
      createActivityInput.travelId,
    );
    if (!traveler) throw new PermissionDeniedError();
    return this.activitiesService.create(createActivityInput);
  }

  @UseGuards(AuthGuard, AllowedGuard)
  @Property(PermissionProperty.TRAVELER, TypeProperty.TRAVEL)
  @Query('activitiesByDate')
  findByDate(@Args('date') date: Date, @Args('id') id: number) {
    return this.activitiesService.findByDate(date, id);
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

  @ResolveField('travel')
  getTravel(
    @Parent() activity: Activity,
    @Context('dataloader') dataloader: DataLoaderInterface,
  ) {
    return dataloader.getByTravel().one.load(activity.travelId);
  }

  @ResolveField('category')
  getCategory(
    @Parent() activity: Activity,
    @Context('dataloader') dataloader: DataLoaderInterface,
  ) {
    return dataloader.getByCategory().one.load(activity.categoryId);
  }
}
