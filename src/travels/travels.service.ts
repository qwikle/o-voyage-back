import { Injectable } from '@nestjs/common';
import { CreateTravelInput } from './dto/create-travel.input';
import { UpdateTravelInput } from './dto/update-travel.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { Repository } from 'typeorm';
import { LoaderService } from 'src/commons/dataloader';

@Injectable()

export class TravelsService {
constructor(
  @InjectRepository(Travel)
  private travelRepository: Repository<Travel>
){}

  async create(createTravelInput: CreateTravelInput) {
    const travel = this.travelRepository.create(createTravelInput);
    return this.travelRepository.save(travel);
  }

  findAll() {
    return `This action returns all travels`;
  }

  findOne(id: number) {
    return `This action returns a #${id} travel`;
  }

  update(id: number, updateTravelInput: UpdateTravelInput) {
    return `This action updates a #${id} travel`;
  }

  remove(id: number) {
    return `This action removes a #${id} travel`;
  }
}
