import { Module } from '@nestjs/common';
import { TravelsService } from './travels.service';
import { TravelsResolver } from './travels.resolver';
import { DateScalar } from 'src/scalars/date';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Travel])],
  providers: [TravelsResolver, TravelsService, DateScalar],
})
export class TravelsModule {}
