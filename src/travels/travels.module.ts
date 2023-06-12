import { Module } from '@nestjs/common';
import { TravelsService } from './travels.service';
import { TravelsResolver } from './travels.resolver';
import { DateScalar } from 'src/scalars/date';

@Module({
  providers: [TravelsResolver, TravelsService, DateScalar],
})
export class TravelsModule {}
