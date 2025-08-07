import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FilterDashboardDto } from './dto';
import {
  whereDashboardIncidence,
  generalHelper,
  whereDashboardUser,
  selectDashboardUser,
  perfomanceUser,
} from './helpers';
import { paginationHelper } from '../../common/helpers';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStatistics(filters: FilterDashboardDto): Promise<any> {
    const general = await this.getGeneral(filters);
    const performance = await this.getPerformance(filters);
    return { general, performance };
  }

  async getGeneral(filters: FilterDashboardDto): Promise<any> {
    const where = whereDashboardIncidence(filters);
    const groupIncidence = await this.prisma.incidence.groupBy({
      by: ['status'],
      where,
      _count: { _all: true },
    });
    const groupUser = await this.prisma.user.groupBy({
      by: ['role'],
      where: { deletedAt: null },
      _count: { _all: true },
    });
    return generalHelper(groupIncidence, groupUser);
  }

  async getPerformance(filters: FilterDashboardDto): Promise<any> {
    const { page, limit } = filters;
    const where = whereDashboardUser(filters);
    const paginated = await paginationHelper(
      this.prisma.user,
      {
        where,
        select: selectDashboardUser,
      },
      { page, limit },
    );
    const { data, ...res } = paginated;
    const result = perfomanceUser(filters, data);
    return { data: result, ...res };
  }

  async getTrends(filters: FilterDashboardDto): Promise<any> {
    const where = whereDashboardIncidence(filters);
  }
}
