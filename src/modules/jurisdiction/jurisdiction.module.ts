import { Module } from '@nestjs/common';
import { JurisdictionService } from './jurisdiction.service';
import { JurisdictionController } from './jurisdiction.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [JurisdictionController],
  providers: [JurisdictionService, PrismaService],
  exports: [JurisdictionService],
})
export class JurisdictionModule {}
