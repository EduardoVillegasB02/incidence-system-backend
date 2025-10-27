import { Module } from '@nestjs/common';
import { EvidenceService } from './evidence.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EvidenceController } from './evidence.controller';

@Module({
  providers: [EvidenceService, PrismaService],
  exports: [EvidenceService],
  controllers: [EvidenceController],
})
export class EvidenceModule {}
