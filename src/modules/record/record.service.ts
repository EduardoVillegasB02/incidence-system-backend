import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Evidence, Incidence, Record, Status } from '@prisma/client';
import { CreateRecordDto, UpdateRecordDto } from './dto';
import { PrismaService } from '../../prisma/prisma.service';
import { IncidenceService } from '../incidence/incidence.service';
import { CameraService } from '../camera/camera.service';
import { EvidenceService } from '../evidence/evidence.service';
import { paginationHelper, verifyUpdateFiles } from '../../common/helpers';
import { PaginationQuery } from '../../common/interfaces';
import { getIncidencesByAssign } from '../incidence/helpers';

@Injectable()
export class RecordService {
  constructor(
    private prisma: PrismaService,
    private cameraService: CameraService,
    private evidenceService: EvidenceService,
    private incidenceService: IncidenceService,
  ) {}

  async create(
    dto: CreateRecordDto,
    files: Array<Express.Multer.File>,
    user: any,
  ) {
    const { role, userId } = user;
    const incidence = await this.incidenceService.getIncidenceById(
      dto.incidenceId,
      false,
      true,
    );
    await getIncidencesByAssign(this.prisma, role, userId, incidence.id);
    if (dto.cameraId) await this.cameraService.findOne(dto.cameraId);
    const record = await this.prisma.record.create({
      data: { ...dto, userId },
    });
    if (files.length) await this.evidenceService.create(files, record.id);
    return await this.findOne(record.id);
  }

  async findAll(pagination: PaginationQuery, user: any) {
    const { role, userId } = user;
    const where: any = ['hunter', 'operator'].includes(role) ? { userId } : {};
    return await paginationHelper(
      this.prisma.record,
      {
        where,
        include: {
          camera: true,
          evidences: {
            where: {
              deletedAt: null,
            }
          },
          incidence: true,
          user: true,
        },
        orderBy: { createdAt: 'desc' },
      },
      pagination,
    );
  }

  async findOne(id: string) {
    return await this.getRecordById(id);
  }

  async update(
    id: string,
    dto: UpdateRecordDto,
    files: Array<Express.Multer.File>,
    user: any,
  ) {
    const { role, userId } = user;
    const record = await this.getRecordById(id);
    if (record.incidence.status !== Status.process)
      throw new ConflictException(
        'The incident has been completed, you cannot make changes',
      );
    if (dto.incidenceId)
      throw new BadRequestException('You cannot switch to another incident');
    if (dto.cameraId) this.cameraService.findOne(dto.cameraId);
    await getIncidencesByAssign(this.prisma, role, userId, record.incidenceId);
    verifyUpdateFiles(files, record.evidences);
    await this.prisma.record.update({
      data: { ...dto, userId },
      where: { id },
    });
    if (files.length) await this.evidenceService.create(files, record.id);
    return await this.findOne(record.id);
  }

  async delete(id: string) {
    const record = await this.getRecordById(id);
    if (record.incidence.status !== Status.process)
      throw new ConflictException(
        'The incident has been completed, you cannot make changes',
      );
    return this.prisma.record.update({
      data: { deletedAt: new Date() },
      where: { id },
    });
  }

  private async getRecordById(id: string): Promise<
    Record & {
      incidence: Incidence;
      evidences: Evidence[];
    }
  > {
    const record = await this.prisma.record.findUnique({
      where: { id },
      include: {
        camera: true,
        evidences: true,
        incidence: true,
        user: true,
      },
    });
    if (!record) throw new BadRequestException('Record is not found');
    if (record.deletedAt) throw new BadRequestException('Record is deleted');
    return record;
  }
}
