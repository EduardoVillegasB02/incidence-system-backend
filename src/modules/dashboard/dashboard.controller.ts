import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { FilterDashboardDto } from './dto';
import { JwtAuthGuard, Roles, RolesGuard } from '../../auth/guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Roles('administrator', 'supervisor')
  @Get()
  statistics(@Query() filters: FilterDashboardDto) {
    return this.dashboardService.getStatistics(filters);
  }

  @Get('general')
  general(@Query() filters: FilterDashboardDto) {
    return this.dashboardService.getGeneral(filters);
  }

  @Get('performance')
  performance(@Query() filters: FilterDashboardDto) {
    return this.dashboardService.getPerformance(filters);
  }

  @Get('trends')
  trends(@Query() filters: FilterDashboardDto) {
    return this.dashboardService.getTrends(filters);
  }
}
