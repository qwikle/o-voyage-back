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

  @UseGuards(AuthGuard)
  async update(
    id: number,
    updateTravelInput: UpdateTravelInput,
    @Context() { req }: OContext,
  ) {
    const travel = await this.travelRepository.findOneBy({ id });
    const { auth } = req;
    if (!travel) {
      throw new Error('Travel not found');
    }
    if (auth.id !== travel.organizerId) {
      if (auth.role !== 2) {
        throw new Error('You are not allowed to update travel');
      }

      return this.travelRepository.merge(travel, { ...updateTravelInput });
    }
  }

  async remove(id: number) {
    await this.travelRepository.delete(id);
    return true;
  }
}
