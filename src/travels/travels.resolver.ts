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
import { OContext } from 'src/commons/types/context';
import { ExistsGuard } from 'src/commons/guards/exists.guard';
import { Entity } from 'src/commons/guards/Entity.decorator';
import { Travel } from './entities/travel.entity';
import { AdminGuard, Role } from 'src/commons/guards/admin.guard';
import { AllowedGuard } from 'src/commons/guards/allowed.guard';
import { Property } from 'src/commons/guards/Property.decorator';
import { PermissionDeniedError } from 'src/commons/exceptions/denied';
import { DataloaderService } from 'src/commons/dataloader/dataloader.service';
import { PermissionProperty, TypeProperty } from 'src/commons/types/guard';
import { DataLoaderInterface } from 'src/commons/types/dataloader';

@Resolver('Travel')
export class TravelsResolver {
  constructor(
    private readonly travelsService: TravelsService,
    private readonly dataloaderService: DataloaderService,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation('createTravel')
  async create(
    @Args('createTravelInput') createTravelInput: CreateTravelInput,
    @Context() { req }: OContext,
  ) {
    const { auth } = req;
    if (auth.id !== createTravelInput.organizerId) {
      if (auth.role !== Role.ADMIN) {
        throw new PermissionDeniedError();
      }
    }
    return this.travelsService.create(createTravelInput);
  }
  @UseGuards(AuthGuard, AdminGuard)
  @Query('travels')
  findAll() {
    return this.travelsService.findAll();
  }

  @UseGuards(AuthGuard, AllowedGuard)
  @Entity('Travel')
  @Property(PermissionProperty.TRAVELER, TypeProperty.TRAVEL)
  @Query('travel')
  findOne(@Args('id') id: number) {
    return this.travelsService.findOne(id);
  }

  @UseGuards(AuthGuard, ExistsGuard, AllowedGuard)
  @Entity('Travel')
  @Property(PermissionProperty.ORGANIZER, TypeProperty.TRAVEL)
  @Mutation('updateTravel')
  async update(
    @Args('updateTravelInput') updateTravelInput: UpdateTravelInput,
    @Context('updateTravel') travel: Travel,
  ) {
    return this.travelsService.update(travel, updateTravelInput);
  }

  @UseGuards(AuthGuard, ExistsGuard, AllowedGuard)
  @Entity('Travel')
  @Property(PermissionProperty.ORGANIZER, TypeProperty.TRAVEL)
  @Mutation('removeTravel')
  remove(@Context('removeTravel') travel: Travel) {
    return this.travelsService.remove(travel.id);
  }

  @UseGuards(AuthGuard, ExistsGuard)
  @Entity('Travel')
  @Property(PermissionProperty.TRAVELER, TypeProperty.TRAVEL)
  @Mutation('addTravelerToTravel')
  async addTravelerToTravel(@Context('addTravelerToTravel') travel: Travel, @Context() {req}: OContext){
    const {auth} = req;
    await this.travelsService.addTravelersToTravel(auth.id, travel.id)
      return travel;
  }


  // Warning : handle the exception if the organizer deletes itself
  @UseGuards(AuthGuard, ExistsGuard, AllowedGuard)
  @Entity('Travel')
  @Property(PermissionProperty.TRAVELER, TypeProperty.TRAVEL)
  @Mutation('removeTravelerFromTravel')
  async removeTravelerFromTravel(@Args('travelerId') travelerId: number, @Context('removeTravelerFromTravel') travel: Travel, @Context() {req}: OContext){
    const {auth} = req;
    if(auth.id !== travel.organizerId){
      if(travelerId !== auth.id){
        throw new PermissionDeniedError();
      }
    }
    return this.travelsService.removeTravelerFromTravel(travelerId, travel.id)
  }


  @ResolveField('travelers')
  async getTravelers(
    @Parent() travel: Travel,
    @Context('dataloader') dataloader: DataLoaderInterface,
  ) {
    return dataloader.getTravelers().load(travel.id);
  }

  @ResolveField('activities')
  async getActivities(
    @Parent() travel: Travel,
    @Context('dataloader') dataloader: DataLoaderInterface,
  ) {
    return dataloader.getByActivity().by.manyTravelId.load(travel.id);
  }

  @ResolveField('organizer')
  async getOrganizer(
    @Parent() travel: Travel,
    @Context('dataloader') dataloader: DataLoaderInterface,
  ) {
    return dataloader.getByUser().one.load(travel.organizerId);
  }
}
