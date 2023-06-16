import { Injectable } from '@nestjs/common';
import { CreateActivityInput } from './dto/create-activity.input';
import { UpdateActivityInput } from './dto/update-activity.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  create(createActivityInput: CreateActivityInput) {
    const activity = this.activityRepository.create(createActivityInput);
    return this.activityRepository.save(activity);
  }

  findAll() {
    return this.activityRepository.find();
  }

  findOne(id: number) {
    return this.activityRepository.findOneBy({ id });
  }

  update(activity: Activity, updateActivityInput: UpdateActivityInput) {
    activity = this.activityRepository.merge(activity, { ...updateActivityInput });
    return this.activityRepository.save(activity);
  }

  async remove(id: number) {
    await this.activityRepository.delete(id)
    return true;
  }
}
