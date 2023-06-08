import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TravelsService } from './travels.service';
import { CreateTravelInput } from './dto/create-travel.input';
import { UpdateTravelInput } from './dto/update-travel.input';

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

  @Mutation('removeTravel')
  remove(@Args('id') id: number) {
    return this.travelsService.remove(id);
  }
}
