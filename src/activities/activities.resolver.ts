import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ActivitiesService } from './activities.service';
import { CreateActivityInput } from './dto/create-activity.input';
import { UpdateActivityInput } from './dto/update-activity.input';

@Resolver('Activity')
export class ActivitiesResolver {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Mutation('createActivity')
  create(@Args('createActivityInput') createActivityInput: CreateActivityInput) {
    return this.activitiesService.create(createActivityInput);
  }

  @Query('activities')
  findAll() {
    return this.activitiesService.findAll();
  }

  @Query('activity')
  findOne(@Args('id') id: number) {
    return this.activitiesService.findOne(id);
  }

  @Mutation('updateActivity')
  update(@Args('updateActivityInput') updateActivityInput: UpdateActivityInput) {
    return this.activitiesService.update(updateActivityInput.id, updateActivityInput);
  }

  @Mutation('removeActivity')
  remove(@Args('id') id: number) {
    return this.activitiesService.remove(id);
  }
}
