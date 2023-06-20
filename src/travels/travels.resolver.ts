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
import { Role } from 'src/commons/guards/admin.guard';
import {
  AllowedGuard,
  PermissionProperty,
  TypeProperty,
} from 'src/commons/guards/allowed.guard';
import { Property } from 'src/commons/guards/Property.decorator';
import { DataloaderService } from 'src/commons/dataloader/dataloader.service';
import { PermissionDeniedError } from 'src/commons/exceptions/denied';

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
  // TODO UNCOMMENT THIS
  //@UseGuards(AuthGuard)
  @Query('travels')
  findAll(@Context() { req }: OContext) {
    /*     const { auth } = req;
    if (auth.role === Role.ADMIN) {
      return this.travelsService.findAll();
    }
    return this.travelsService.findAllByOrganizerId(auth.id); */
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

  @ResolveField('travelers')
  async getTravelers(@Parent() travel: Travel) {
    return this.dataloaderService.getTravelers().load(travel.id);
  }

  @ResolveField('activities')
  async getActivities(@Parent() travel: Travel) {
    return this.dataloaderService.getByActivity().many.load(travel.id);
  }

  @ResolveField('organizer')
  async getOrganizer(@Parent() travel: Travel) {
    return this.dataloaderService.getByUser().one.load(travel.organizerId);
  }
}
