import { Module } from '@nestjs/common';
import { CrimeService } from './crime.service';
import { CrimeController } from './crime.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [CrimeController],
  providers: [CrimeService, PrismaService],
  exports: [CrimeService],
})
export class CrimeModule {}
