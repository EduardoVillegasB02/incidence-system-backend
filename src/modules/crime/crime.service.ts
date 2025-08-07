import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Crime } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CrimeService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CrimeCreateInput): Promise<Crime> {
    return await this.prisma.crime.create({ data });
  }

  async findAll(): Promise<Crime[]> {
    return await this.prisma.crime.findMany({
      where: { deletedAt: null },
    });
  }

  async findOne(id: string): Promise<Crime> {
    return await this.getCrimeById(id);
  }

  async update(id: string, data: Prisma.CrimeUpdateInput): Promise<Crime> {
    await this.getCrimeById(id);
    return this.prisma.crime.update({
      data,
      where: { id },
    });
  }

  async delete(id: string): Promise<Crime> {
    await this.getCrimeById(id);
    return this.prisma.crime.update({
      data: { deletedAt: new Date() },
      where: { id },
    });
  }

  private async getCrimeById(id: string): Promise<Crime> {
    const crime = await this.prisma.crime.findUnique({
      where: { id },
    });
    if (!crime) throw new BadRequestException('Crime is not found');
    if (crime.deletedAt) throw new BadRequestException('Crime is deleted');
    return crime;
  }
}
