import { Module } from '@nestjs/common';
import { ZoneService } from './zone.service';
import { ZoneController } from './zone.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ZoneController],
  providers: [ZoneService, PrismaService],
  exports: [ZoneService],
})
export class ZoneModule {}
