import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Incidence, Status } from '@prisma/client';
import {
  CreateIncidenceDto,
  FilterIncidenceDto,
  UpdateIncidenceDto,
} from './dto';
import { PrismaService } from '../../prisma/prisma.service';
import { CommunicationService } from '../communication/communication.service';
import { CrimeService } from '../crime/crime.service';
import { ZoneService } from '../zone/zone.service';
import { paginationHelper } from '../../common/helpers';
import {
  buildWhereIncidence,
  getIncidencesByAssign,
  includeIncidence,
  validateCode,
  validateStatus,
  verifyFields,
} from './helpers';

@Injectable()
export class IncidenceService {
  constructor(
    private prisma: PrismaService,
    private communicationService: CommunicationService,
    private crimeService: CrimeService,
    private zoneService: ZoneService,
  ) {}

  async create(dto: CreateIncidenceDto, user: any): Promise<Incidence> {
    const { userId } = user;
    await this.communicationService.findOne(dto.communicationId);
    await this.crimeService.findOne(dto.crimeId);
    await this.zoneService.findOne(dto.zoneId);
    await validateCode(this.prisma, dto.code);
    const incidence = await this.prisma.incidence.create({
      data: { ...dto, userId },
    });
    await this.prisma.assignment.create({
      data: { incidenceId: incidence.id, userId },
    });
    return incidence;
  }

  async findAll(filters: FilterIncidenceDto, user: any) {
    const { role, userId } = user;
    const { page, limit } = filters;
    const incidencesId = await getIncidencesByAssign(this.prisma, role, userId);
    const where = buildWhereIncidence(filters, incidencesId);
    return await paginationHelper(
      this.prisma.incidence,
      {
        where,
        include: includeIncidence,
        orderBy: { updatedAt: 'desc' },
      },
      { page, limit },
    );
  }

  async findOne(id: string, user: any) {
    const { role, userId } = user;
    const incidence = await this.getIncidenceById(id, true);
    // if (['hunter', 'operator'].includes(role)) {
    //   const assignment = await this.prisma.assignment.findFirst({
    //     where: { incidenceId: id, userId },
    //   });
    //   if (!assignment)
    //     throw new ForbiddenException('You do not have access to this incident');
    // }
    return incidence;
  }

  async update(id: string, dto: UpdateIncidenceDto, user: any) {
    const { role, userId } = user;
    const incidence = await this.getIncidenceById(id, false);
    //await verifyFields(dto, role);
    await validateStatus(dto, incidence);
    if (dto.communicationId)
      await this.communicationService.findOne(dto.communicationId);
    if (dto.crimeId) await this.crimeService.findOne(dto.crimeId);
    if (dto.zoneId) await this.zoneService.findOne(dto.zoneId);
    await validateCode(this.prisma, dto.code);
    await this.prisma.incidence.update({
      data: { ...dto, userId },
      where: { id },
    });
    return await this.getIncidenceById(id, true);
  }

  async delete(id: string) {
    await this.getIncidenceById(id);
    return this.prisma.incidence.update({
      data: { deletedAt: new Date() },
      where: { id },
    });
  }

  async getIncidenceById(
    id: string,
    addInclude: boolean = false,
    inProcess: boolean = false,
  ): Promise<Incidence> {
    const include = addInclude ? includeIncidence : {};
    const incidence = await this.prisma.incidence.findFirst({
      where: { id },
      include,
    });
    if (!incidence) throw new BadRequestException('Incidence is not found');
    if (incidence.deletedAt)
      throw new BadRequestException('Incidence is deleted');
    if (inProcess && incidence.status != Status.process)
      throw new BadRequestException('This incident has completed or finished');
    return incidence;
  }
}
