import { Injectable } from '@nestjs/common';
import { CreateTravelInput } from './dto/create-travel.input';
import { UpdateTravelInput } from './dto/update-travel.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { DataSource, Repository } from 'typeorm';
import { Hash } from 'src/commons/bcrypt';
import * as ms from 'ms';

@Injectable()
export class TravelsService {
  constructor(
    @InjectRepository(Travel)
    private travelRepository: Repository<Travel>,
    private datasource: DataSource,
    private hash: Hash,
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

  update(travel: Travel, updateTravelInput: UpdateTravelInput) {
    travel = this.travelRepository.merge(travel, { ...updateTravelInput });
    return this.travelRepository.save(travel);
  }

  async remove(id: number) {
    await this.travelRepository.delete(id);
    return true;
  }

  addTravelersToTravel(travelerId: number, travelId: number) {
    return this.datasource.query(
      `
    INSERT INTO "has_travelers"
    ("traveler_id", "travel_id") 
    VALUES ($1, $2)
    RETURNING *
    `,
      [travelerId, travelId],
    );
  }

  async generateInvitationLink(travel: Travel) {
    const invitationToken = await this.hash.encrypt(
      JSON.stringify({ id: travel.id, exp: ms('8h') }),
    );
    const link = `invitation?travelId=${travel.id}&token=${invitationToken}`;
    return link;
  }
  async removeTravelerFromTravel(travelerId: number, travelId: number) {
    await this.datasource.query(
      `
    DELETE FROM "has_travelers"
    WHERE "traveler_id" = $1 AND "travel_id" = $2
    `,
      [travelerId, travelId],
    );
    return true;
  }
}
