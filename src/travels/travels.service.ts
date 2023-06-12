import { Injectable } from '@nestjs/common';
import { CreateTravelInput } from './dto/create-travel.input';
import { UpdateTravelInput } from './dto/update-travel.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { Repository } from 'typeorm';
@Injectable()
export class TravelsService {
  constructor(
    @InjectRepository(Travel)
    private travelRepository: Repository<Travel>,
  ) {}

  async create(createTravelInput: CreateTravelInput) {
    const travel = this.travelRepository.create(createTravelInput);
    return this.travelRepository.save(travel);
  }

  findAll() {
    return `This action returns all travels`;
  }

  findOne(id: number) {
    return this.travelRepository.findOneBy({ id });
  }

  async update(id: number, updateTravelInput: UpdateTravelInput) {
    const travel = await this.travelRepository.findOneBy({id})
    if(!travel){
      throw new Error('You cannot modify this travel')
    }
    return this.travelRepository.merge(travel, {...updateTravelInput})
  }

  async remove(id: number) {
    await this.travelRepository.delete(id);
    return true;
  }
}
