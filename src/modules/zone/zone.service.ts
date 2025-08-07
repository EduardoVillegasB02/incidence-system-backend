import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Zone } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ZoneService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ZoneCreateInput): Promise<Zone> {
    return await this.prisma.zone.create({ data });
  }

  async findAll(): Promise<Zone[]> {
    return await this.prisma.zone.findMany({
      where: { deletedAt: null },
      include: { jurisdictions: true },
    });
  }

  async findOne(id: string): Promise<Zone> {
    return await this.getZoneById(id);
  }

  async update(id: string, data: Prisma.ZoneUpdateInput): Promise<Zone> {
    await this.getZoneById(id);
    return this.prisma.zone.update({
      data,
      where: { id },
    });
  }

  async delete(id: string): Promise<Zone> {
    await this.getZoneById(id);
    return this.prisma.zone.update({
      data: { deletedAt: new Date() },
      where: { id },
    });
  }

  private async getZoneById(id: string): Promise<Zone> {
    const zone = await this.prisma.zone.findUnique({
      where: { id },
      include: { jurisdictions: true },
    });
    if (!zone) throw new BadRequestException('Zone is not found');
    if (zone.deletedAt) throw new BadRequestException('Zone is deleted');
    return zone;
  }
}
