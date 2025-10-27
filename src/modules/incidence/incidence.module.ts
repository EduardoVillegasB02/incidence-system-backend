import { Module } from '@nestjs/common';
import { IncidenceService } from './incidence.service';
import { IncidenceController } from './incidence.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { CommunicationModule } from '../communication/communication.module';
import { CrimeModule } from '../crime/crime.module';
import { ZoneModule } from '../zone/zone.module';
import { JurisdictionModule } from '../jurisdiction/jurisdiction.module';

@Module({
  imports: [CommunicationModule, CrimeModule, JurisdictionModule, ZoneModule],
  controllers: [IncidenceController],
  providers: [IncidenceService, PrismaService],
  exports: [IncidenceService],
})
export class IncidenceModule {}
