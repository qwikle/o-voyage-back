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
import { PermissionProperty, TypeProperty } from 'src/commons/types/guard';
import { DataLoaderInterface } from 'src/commons/types/dataloader';

@Resolver('Travel')
export class TravelsResolver {
  constructor(private readonly travelsService: TravelsService) {}

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
  @Mutation('addTravelerToTravel')
  async addTravelerToTravel(
    @Args('token') token: string,
    @Context('addTravelerToTravel') travel: Travel,
    @Context() { req }: OContext,
  ) {
    const { auth } = req;
    const checked = await this.travelsService.checkInvitationToken(
      travel.id,
      token,
    );
    if (!checked) {
      throw new PermissionDeniedError();
    }
    await this.travelsService.addTravelersToTravel(auth.id, travel.id);
    return travel;
  }

  @UseGuards(AuthGuard, ExistsGuard, AllowedGuard)
  @Entity('Travel')
  @Property(PermissionProperty.TRAVELER, TypeProperty.TRAVEL)
  @Mutation('removeTravelerFromTravel')
  async removeTravelerFromTravel(
    @Args('travelerId') travelerId: number,
    @Context('removeTravelerFromTravel') travel: Travel,
    @Context() { req }: OContext,
  ) {
    const { auth } = req;
    if (auth.id !== travel.organizerId) {
      if (travelerId !== auth.id || travelerId === travel.organizerId) {
        throw new PermissionDeniedError();
      }
    }

    return this.travelsService.removeTravelerFromTravel(travelerId, travel.id);
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

  @UseGuards(AuthGuard)
  @ResolveField('invitationLink')
  getInvitationLink(
    @Parent() travel: Travel,
    @Context('req') { auth },
  ): Promise<string> {
    if (auth.id !== travel.organizerId) {
      return null;
    }
    return this.travelsService.generateInvitationLink(travel);
  }

  @UseGuards(AuthGuard)
  @Query('travelBySlug')
  async getTravelBySlug(@Args('slug') slug: string, @Context('req') { auth }) {
    const travel = await this.travelsService.getTravelBySlug(slug);
    if (!travel) {
      return null;
    }
    const isTraveler = await this.travelsService.isTraveler(auth.id, travel.id);
    if (!isTraveler) {
      throw new PermissionDeniedError();
    }
    return travel;
  }
}
