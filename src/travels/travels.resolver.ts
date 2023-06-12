import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { TravelsService } from './travels.service';
import { CreateTravelInput } from './dto/create-travel.input';
import { UpdateTravelInput } from './dto/update-travel.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { OContext } from 'src/commons/context';

@Resolver('Travel')
export class TravelsResolver {
  constructor(private readonly travelsService: TravelsService) {}

  @Mutation('createTravel')
  create(@Args('createTravelInput') createTravelInput: CreateTravelInput) {
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

  @Mutation('updateTravel')
  update(@Args('updateTravelInput') updateTravelInput: UpdateTravelInput) {
    return this.travelsService.update(updateTravelInput.id, updateTravelInput);
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
}
