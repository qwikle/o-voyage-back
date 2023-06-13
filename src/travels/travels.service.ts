import { Injectable, UseGuards } from '@nestjs/common';
import { CreateTravelInput } from './dto/create-travel.input';
import { UpdateTravelInput } from './dto/update-travel.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { Repository } from 'typeorm';
import { AuthGuard } from 'src/auth/auth.guard';
import { Context } from '@nestjs/graphql';
import { OContext } from 'src/commons/context';
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

 
  async update(
    travel: Travel,
    updateTravelInput: UpdateTravelInput
  ) {
      const updatedTravel = await this.travelRepository.merge(travel, { ...updateTravelInput });
      return updatedTravel;
  }

  async remove(id: number) {
    await this.travelRepository.delete(id);
    return true;
  }
}
