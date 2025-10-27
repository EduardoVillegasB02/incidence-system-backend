import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { CrimeModule } from '../crime/crime.module';

@Module({
  imports: [CrimeModule],
  controllers: [DashboardController],
  providers: [DashboardService, PrismaService],
})
export class DashboardModule {}
