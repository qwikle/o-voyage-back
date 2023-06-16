import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ActivitiesService } from './activities.service';
import { CreateActivityInput } from './dto/create-activity.input';
import { UpdateActivityInput } from './dto/update-activity.input';
import { DataloaderService } from 'src/commons/dataloader/dataloader.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ExistsGuard } from 'src/commons/guards/exists.guard';
import { AllowedGuard } from 'src/commons/guards/allowed.guard';
import { Entity } from 'src/commons/guards/Entity.decorator';

@Resolver('Activity')
export class ActivitiesResolver {
  constructor(
    private readonly activitiesService: ActivitiesService,
    private readonly dataloaderService: DataloaderService,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation('createActivity')
  async create(
    @Args('createActivityInput') createActivityInput: CreateActivityInput,
  ) {
    // TODO check if user is organizer of the travel
    return this.activitiesService.create(createActivityInput);
  }

  
  @Query('activities')
  findAll() {
    return this.activitiesService.findAll();
  }

  @Query('activity')
  findOne(@Args('id') id: number) {
    return this.dataloaderService.getByActivity().load(id);
  }

  @Mutation('updateActivity')
  update(
    @Args('updateActivityInput') updateActivityInput: UpdateActivityInput,
  ) {
    return this.activitiesService.update(
      updateActivityInput.id,
      updateActivityInput,
    );
  }

  @UseGuards(AuthGuard, ExistsGuard, AllowedGuard)
  @Entity('Activity')
  @Mutation('removeActivity')
  remove(@Args('id') id: number) {
    return this.activitiesService.remove(id);
  }
}
