import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import { PrismaService } from '../../prisma/prisma.service';
import { CrimeService } from '../crime/crime.service';
import { FilterDashboardDto } from './dto';
import {
  whereDashboardIncidence,
  generalHelper,
  whereDashboardUser,
  selectDashboardUser,
  perfomanceUser,
  getTrendsTemplate,
} from './helpers';
import { paginationHelper } from '../../common/helpers';
import { Trend } from './types';

@Injectable()
export class DashboardService {
  constructor(
    private configService: ConfigService,
    private crimeService: CrimeService,
    private prisma: PrismaService,
  ) {}

  async getStatistics(filters: FilterDashboardDto): Promise<any> {
    const general = await this.getGeneral(filters);
    const performance = await this.getPerformance(filters);
    const trends = await this.getTrends(filters);
    return { general, performance, trends };
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

  async getTrends(filters: FilterDashboardDto) {
    const { start, end } = filters;
    if (!start || !end)
      throw new Error('Es necesario ingresar la fecha de inicio y de fin');
    const s = new Date(`${start}T00:00:00.000Z`);
    const e = new Date(`${end}T23:59:59.999Z`);
    const PREVIEW_DATE = new Date('2025-06-30T23:59:59.999Z');
    const MIN_DATE = new Date('2025-07-01T00:00:00.000Z');
    const MAX_DATE = new Date('2025-08-03T23:59:59.999Z');
    const NEXT_DATE = new Date('2025-08-04T00:00:00.000Z');
    if (e < MIN_DATE) return await this.getTrendsHunter(s, e);
    if (s >= NEXT_DATE) return await this.getTrendsHunter(s, e);
    if (s >= MIN_DATE && e <= MAX_DATE) return await this.getTrendsReal(s, e);
    if (s < MIN_DATE && e <= MAX_DATE) {
      const trend1 = await this.getTrendsHunter(s, PREVIEW_DATE);
      const trend2 = await this.getTrendsReal(MIN_DATE, e);
      return await this.joinTrends(trend1, trend2);
    }
    if (s < MIN_DATE && e > MAX_DATE) {
      const trend1 = await this.getTrendsHunter(s, PREVIEW_DATE);
      const trend2 = await this.getTrendsReal(MIN_DATE, MAX_DATE);
      const trend3 = await this.getTrendsHunter(NEXT_DATE, e);
      return await this.joinTrends(trend1, trend2, trend3);
    }
    if (s >= MIN_DATE && e > MAX_DATE) {
      const trend1 = await this.getTrendsReal(s, MAX_DATE);
      const trend2 = await this.getTrendsHunter(NEXT_DATE, e);
      return await this.joinTrends(trend1, trend2);
    }
    return await this.getTrendsHunter(s, e);
  }

  private async getTrendsHunter(start: Date, end: Date) {
    if (!start || !end)
      throw new Error('Es necesario ingresar la fecha de inicio y de fin');
    const where: any = {
      deletedAt: null,
      date: {
        gte: start,
        lte: end,
      },
    };
    const incidences = await this.prisma.incidence.findMany({
      where,
      select: {
        crime: { select: { field: true } },
        date: true,
        status: true,
      },
    });
    const crimes = await this.crimeService.getCrimesDashboard();
    const fields = crimes.map((c: Record<string, number>) => c.field);
    const trends = getTrendsTemplate(start, end, fields);
    for (const incidence of incidences) {
      if (!incidence.date || !incidence.status || !incidence.crime.field)
        continue;
      const date = incidence.date.toISOString().split('T')[0];
      const hour = Number(
        incidence.date.toISOString().split('T')[1].split(':')[0],
      );
      const day = trends.days.find((d) => d.date === date);
      if (!day) continue;
      day.assigned++;
      day.hours[hour].assigned++;
      trends.totalAssigned++;
      const field = incidence.crime.field;
      const dayCrimenPrev = day.crimen;
      const hourCrimenPrev = day.hours[hour].crimen;
      const dayVal =
        (Object.hasOwn?.(dayCrimenPrev, field)
          ? dayCrimenPrev[field]
          : (dayCrimenPrev[field] ?? 0)) + 1;
      const hourVal =
        (Object.hasOwn?.(hourCrimenPrev, field)
          ? hourCrimenPrev[field]
          : (hourCrimenPrev[field] ?? 0)) + 1;
      day.crimen = { ...dayCrimenPrev, [field]: dayVal };
      day.hours[hour].crimen = { ...hourCrimenPrev, [field]: hourVal };
      if (['completed', 'finished'].includes(incidence.status)) {
        day.finished++;
        day.hours[hour].finished++;
        trends.totalFinished++;
      }
    }
    return trends;
  }

  private async getTrendsReal(start: Date, end: Date) {
    if (!start || !end)
      throw new Error('Es necesario ingresar la fecha de inicio y de fin');
    const days = await this.loadJson();
    const result = days.filter(
      (d: any) => new Date(d.date) >= start && new Date(d.date) <= end,
    );
    const totalAssigned = result.reduce(
      (sum: number, d: any) => sum + (d.assigned ?? 0),
      0,
    );
    const totalFinished = result.reduce(
      (sum: number, d: any) => sum + (d.finished ?? 0),
      0,
    );
    return {
      totalAssigned,
      totalFinished,
      days: result,
    };
  }

  private async joinTrends(...trends: Trend[]): Promise<Trend> {
    const result: Trend = { totalAssigned: 0, totalFinished: 0, days: [] };
    for (const trend of trends) {
      result.totalAssigned += trend.totalAssigned;
      result.totalFinished += trend.totalFinished;
      trend.days.forEach((d) => result.days.push(d));
    }
    return result;
  }

  private async loadJson() {
    const jsonPath = this.configService.get<string>('INCIDENCE_JSON_PATH');
    if (!jsonPath)
      throw new InternalServerErrorException(
        'INCIDENCE_JSON_PATH is not configured in environment variables',
      );
    const raw = await fs.readFile(jsonPath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.days) ? parsed.days : [];
  }
}
