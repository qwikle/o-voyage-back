import { Injectable } from '@nestjs/common';
import { CreateTravelInput } from './dto/create-travel.input';
import { UpdateTravelInput } from './dto/update-travel.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TravelsService {
  constructor(
    @InjectRepository(Travel)
    private travelRepository: Repository<Travel>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createTravelInput: CreateTravelInput) {
    const travel = this.travelRepository.create(createTravelInput);
    return this.travelRepository.save(travel);
  }

  findAll() {
    return this.travelRepository.find();
  }

  findOne(id: number) {
    return this.travelRepository.findOneBy({ id });
  }
 
  async update(
    travel: Travel,
    updateTravelInput: UpdateTravelInput
  ) {
       travel = this.travelRepository.merge(travel, { ...updateTravelInput });
       return this.travelRepository.save(travel);

  }

  async remove(id: number) {
    await this.travelRepository.delete(id);
    return true;
  }

  async getAttendees(id: number) {
    const travel = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin(
        'has_attendees',
        'has_attendees',
        'has_attendees.attendee_id = user.id',
      )
      .where('has_attendees.travel_id = :travelId', { travelId: id })
      .getMany();
    return travel;
  }

  async getOrganizer(id: number) {
    return this.userRepository.findOneBy({ id });
  }
}
