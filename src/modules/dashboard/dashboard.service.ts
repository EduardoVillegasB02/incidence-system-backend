import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { addDays, differenceInCalendarDays } from 'date-fns';
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
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async getStatistics(filters: FilterDashboardDto): Promise<any> {
    const general = await this.getGeneral(filters);
    const performance = await this.getPerformance(filters);
    const trends = await this.getTrendsReal(filters);
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
    if (!start || !end) throw new Error('Debes enviar start y end');
    const startDate = `${start}T00:00:00.000Z`;
    const endDate = `${end}T23:59:59.999Z`;
    const daysCount = differenceInCalendarDays(endDate, startDate);
    console.log("daysCount:", daysCount);
    const where: any = {
      deletedAt: null,
      date: {
        gte: startDate,
        lte: endDate,
      },
    };
    const incidences = await this.prisma.incidence.findMany({
      where,
      select: {
        date: true,
        status: true,
      },
    });
    const grouped: Record<
      string,
      Record<number, { assigned: number; finished: number }>
    > = {};
    let totalAssigned = 0;
    let totalFinished = 0;
    for (const incidence of incidences) {
      if (!incidence.date || !incidence.status) continue;
      const dateStr = incidence.date.toISOString().split('T')[0];
      const hour = Number(incidence.date.toISOString().split('T')[1].split(':')[0])
      console.log(incidence.date);
      console.log('dateStr:', dateStr);
      console.log('hora:', hour);
      let type: 'assigned' | 'finished' | null = null;
      if (['process', 'completed'].includes(incidence.status)) type = 'assigned';
      else if (incidence.status === 'finished') type = 'finished';
      if (!type) continue;
      if (!grouped[dateStr]) grouped[dateStr] = {};
      if (!grouped[dateStr][hour]) grouped[dateStr][hour] = { assigned: 0, finished: 0 };
      grouped[dateStr][hour][type]++;
      if (type === 'assigned') totalAssigned++;
      if (type === 'finished') totalFinished++;
    }
    const result: {
      date: string;
      totalAssigned: number;
      totalFinished: number;
      hours: { hour: number; assigned: number; finished: number }[];
    }[] = [];
    for (let i = 0; i < daysCount; i++) {
      console.log(startDate);
      const dateObj = addDays(startDate, i);
      console.log(dateObj);
      const dateStr = dateObj.toISOString().split('T')[0];
      let dailyAssigned = 0;
      let dailyFinished = 0;
      const hours: { hour: number; assigned: number; finished: number }[] = [];
      for (let hour = 0; hour < 24; hour++) {
        const hourData = grouped[dateStr]?.[hour] ?? { assigned: 0, finished: 0 };
        dailyAssigned += hourData.assigned;
        dailyFinished += hourData.finished;
        hours.push({
          hour,
          assigned: hourData.assigned,
          finished: hourData.finished,
        });
      }
      result.push({
        date: dateStr,
        totalAssigned: dailyAssigned,
        totalFinished: dailyFinished,
        hours,
      });
    }
    return {
      totalAssigned,
      totalFinished,
      days: result,
    };
  }

  async getTrendsReal(filters: FilterDashboardDto) {
    const { start, end } = filters;
    if (!start || !end) throw new Error('Debes enviar start y end');
    const days = await this.loadJson();
    const result = days.filter(d => d.date >= start && d.date <= end);
    const totalAssigned = result.reduce((sum: number, d: any) => sum + (d.assigned ?? 0), 0);
    const totalFinished = result.reduce((sum: number, d: any) => sum + (d.finished ?? 0), 0);
    return {
      totalAssigned,
      totalFinished,
      days: result,
    };
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
