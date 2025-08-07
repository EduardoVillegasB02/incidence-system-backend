import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Jurisdiction } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JurisdictionService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Prisma.JurisdictionUncheckedCreateInput,
  ): Promise<Jurisdiction> {
    return await this.prisma.jurisdiction.create({ data });
  }

  async findAll(): Promise<Jurisdiction[]> {
    return await this.prisma.jurisdiction.findMany({
      where: { deletedAt: null },
      include: { zone: true },
    });
  }

  async findOne(id: string): Promise<Jurisdiction> {
    return await this.getjurisdictionById(id);
  }

  async update(
    id: string,
    data: Prisma.JurisdictionUpdateInput,
  ): Promise<Jurisdiction> {
    await this.getjurisdictionById(id);
    return this.prisma.jurisdiction.update({
      data,
      where: { id },
    });
  }

  async delete(id: string): Promise<Jurisdiction> {
    await this.getjurisdictionById(id);
    return this.prisma.jurisdiction.update({
      data: { deletedAt: new Date() },
      where: { id },
    });
  }

  private async getjurisdictionById(id: string): Promise<Jurisdiction> {
    const jurisdiction = await this.prisma.jurisdiction.findUnique({
      where: { id },
      include: { zone: true },
    });
    if (!jurisdiction)
      throw new BadRequestException('Jurisdiction is not found');
    if (jurisdiction.deletedAt)
      throw new BadRequestException('Jurisdiction is deleted');
    return jurisdiction;
  }
}
