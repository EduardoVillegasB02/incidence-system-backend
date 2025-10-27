import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Incidence, Role, Status } from '@prisma/client';
import {
  CreateIncidenceDto,
  FilterIncidenceDto,
  UpdateIncidenceDto,
} from './dto';
import { PrismaService } from '../../prisma/prisma.service';
import { CommunicationService } from '../communication/communication.service';
import { CrimeService } from '../crime/crime.service';
import { JurisdictionService } from '../jurisdiction/jurisdiction.service';
import { ZoneService } from '../zone/zone.service';
import { paginationHelper } from '../../common/helpers';
import {
  buildWhereIncidence,
  buildUpdateByStatus,
  getIncidencesByAssign,
  includeIncidence,
  validateCode,
  validateNextStatus,
  verifyFields,
  assignHunter,
} from './helpers';

@Injectable()
export class IncidenceService {
  constructor(
    private prisma: PrismaService,
    private communicationService: CommunicationService,
    private crimeService: CrimeService,
    private jurisdictionService: JurisdictionService,
    private zoneService: ZoneService,
  ) {}

  async create(dto: CreateIncidenceDto, user: any): Promise<Incidence> {
    const { role, userId } = user;
    await this.communicationService.findOne(dto.communicationId);
    await this.crimeService.findOne(dto.crimeId);
    await this.zoneService.findOne(dto.zoneId);
    await validateCode(this.prisma, dto.code);
    const incidence = await this.prisma.incidence.create({
      data: { ...dto, userId },
    });
    let userAssigned: string = userId;
    if (role === Role.validator) {
      const id = await assignHunter(this.prisma);
      userAssigned = id ? id : userId;
    }
    await this.prisma.assignment.create({
      data: { incidenceId: incidence.id, userId: userAssigned },
    });
    return incidence;
  }

  async findAll(filters: FilterIncidenceDto, user: any): Promise<any> {
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

  async findOne(id: string, user: any): Promise<Incidence> {
    const { role, userId } = user;
    const incidence = await this.getIncidenceById(id, true);
    /* if (['hunter', 'operator'].includes(role)) {
      const assignment = await this.prisma.assignment.findFirst({
        where: { incidenceId: id, userId },
      });
      if (!assignment)
        throw new ForbiddenException('You do not have access to this incident');
    } */
    return incidence;
  }

  async update(id: string, dto: UpdateIncidenceDto, user: any): Promise<any> {
    const { role, userId } = user;
    const { status } = await this.getIncidenceById(id, false);
    //await verifyFields(dto, role);
    const data = await buildUpdateByStatus(dto, status);
    if (data.communicationId)
      await this.communicationService.findOne(data.communicationId);
    if (data.crimeId) await this.crimeService.findOne(data.crimeId);
    if (data.jurisdictionId)
      await this.jurisdictionService.findOne(data.jurisdictionId);
    if (data.zoneId) await this.zoneService.findOne(data.zoneId);
    await validateCode(this.prisma, dto.code);
    await this.prisma.incidence.update({
      data: { ...data, userWhoUpdated: userId },
      where: { id },
    });
    return await this.getIncidenceById(id, true);
  }

  async delete(id: string): Promise<any> {
    await this.getIncidenceById(id);
    return this.prisma.incidence.update({
      data: { deletedAt: new Date() },
      where: { id },
    });
  }

  async changeStatus(id: string, status: Status): Promise<any> {
    const { code, status: previousStatus } = await this.getIncidenceById(id);
    validateNextStatus(previousStatus, status, code);
    await this.prisma.incidence.update({
      data: { status },
      where: { id },
    });
    return await this.getIncidenceById(id, true);
  }

  async mapIncidences(filters: FilterIncidenceDto): Promise<any> {
    const locations: any = {
      type: 'FeatureCollection',
      name: 'possible_origin_location',
      features: [],
    };
    const where = buildWhereIncidence(filters);
    const incidences = await this.prisma.incidence.findMany({
      select: {
        name: true,
        description: true,
        date: true,
        latitude: true,
        longitude: true,
        homeLatitude: true,
        homeLongitude: true,
        communication: {
          select: { name: true },
        },
        crime: {
          select: { name: true },
        },
      },
      where,
    });
    incidences.map((inc) =>
      locations.features.push({
        type: 'Feature',
        properties: {
          name: inc.name,
          description: inc.description,
          communication: inc.communication.name,
          crime: inc.crime.name,
        },
        geometry: {
          type: 'Point',
          coordinate: [Number(inc.latitude), Number(inc.longitude)],
        },
        origin: !inc.homeLatitude
          ? null
          : {
              type: 'Point',
              coordinates: [inc.homeLatitude, inc.homeLongitude],
            },
      }),
    );
    return locations;
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
