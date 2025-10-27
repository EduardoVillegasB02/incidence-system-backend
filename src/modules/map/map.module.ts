import { Module } from '@nestjs/common';
import { MapController } from './map.controller';
import { IncidenceModule } from '../incidence/incidence.module';

@Module({
  imports: [IncidenceModule],
  controllers: [MapController],
})
export class MapModule {}
