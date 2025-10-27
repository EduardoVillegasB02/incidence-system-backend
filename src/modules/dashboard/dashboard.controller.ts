import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { FilterDashboardDto } from './dto';
import { JwtAuthGuard, Roles, RolesGuard } from '../../auth/guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Roles('administrator', 'supervisor', 'visualizer')
  @Get()
  statistics(@Query() filters: FilterDashboardDto) {
    return this.dashboardService.getStatistics(filters);
  }
}
