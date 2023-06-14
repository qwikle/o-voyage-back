import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { TravelsService } from './travels.service';
import { CreateTravelInput } from './dto/create-travel.input';
import { UpdateTravelInput } from './dto/update-travel.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { OContext } from 'src/commons/context';
import { Travel } from 'src/graphql';

@Resolver('Travel')
export class TravelsResolver {
  constructor(private readonly travelsService: TravelsService) {}

  @UseGuards(AuthGuard)
  @Mutation('createTravel')
  async create(
    @Args('createTravelInput') createTravelInput: CreateTravelInput,
    @Context() { req }: OContext,
  ) {
    const travel = await this.travelsService.findOne(
      createTravelInput.organizerId,
    );
    const { auth } = req;
    if (auth.id !== travel.organizerId) {
      if (auth.role !== 2) {
        throw new Error('You are not the organizer of this travel');
      }
    }
    return this.travelsService.create(createTravelInput);
  }

  @Query('travels')
  findAll() {
    return this.travelsService.findAll();
  }

  @Query('travel')
  findOne(@Args('id') id: number) {
    return this.travelsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Mutation('updateTravel')
  async update(
    @Args('updateTravelInput') updateTravelInput: UpdateTravelInput,
    @Context() { req }: OContext,
  ) {
    const travel = await this.travelsService.findOne(updateTravelInput.id);
    const { auth } = req;
    if (!travel) {
      throw new Error('Travel not found');
    }
    if (auth.id !== travel.organizerId) {
      if (auth.role !== 2) {
        throw new Error('You are not allowed to update this travel');
      }
    }
    const finalTravel = this.travelsService.update(travel, updateTravelInput);
    return finalTravel;
  }

  // TODO refactor into another guard
  @UseGuards(AuthGuard)
  @Mutation('removeTravel')
  async remove(@Args('id') id: number, @Context() { req }: OContext) {
    const travel = await this.travelsService.findOne(id);
    if (!travel) {
      throw new Error('Travel not found');
    }
    const { auth } = req;
    if (travel.organizerId !== auth.id) {
      if (auth.role !== 2) {
        throw new Error('You are not the organizer of this travel');
      }
    }
    return this.travelsService.remove(id);
  }

  @ResolveField('attendees')
  async getAttendees(@Parent() travel: Travel) {
    return this.travelsService.getAttendees(travel.id);
  }

  @ResolveField('organizer')
  async getOrganizer(@Parent() travel) {
    return this.travelsService.getOrganizer(travel.organizerId);
  }
}
