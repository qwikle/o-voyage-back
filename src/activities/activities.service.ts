import { Injectable } from '@nestjs/common';
import { CreateActivityInput } from './dto/create-activity.input';
import { UpdateActivityInput } from './dto/update-activity.input';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    private datasource: DataSource,
  ) {}

  create(createActivityInput: CreateActivityInput) {
    const activity = this.activityRepository.create(createActivityInput);
    return this.activityRepository.save(activity);
  }

  update(activity: Activity, updateActivityInput: UpdateActivityInput) {
    activity = this.activityRepository.merge(activity, {
      ...updateActivityInput,
    });
    return this.activityRepository.save(activity);
  }

  async remove(id: number) {
    await this.activityRepository.delete(id);
    return true;
  }

  findByDate(date: Date, travelId: number) {
    return this.activityRepository.find({ where: { date, travelId } });
  }

  async getTraveler(id: number, travelId: number) {
    const result = await this.datasource.query(
      `
      SELECT * FROM get_one_traveler($1, $2)
      `,
      [id, travelId],
    );
    return result[0];
  }
}
