import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Communication } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CommunicationService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CommunicationCreateInput): Promise<Communication> {
    return await this.prisma.communication.create({ data });
  }

  async findAll(): Promise<Communication[]> {
    return await this.prisma.communication.findMany({
      where: { deletedAt: null },
    });
  }

  async findOne(id: string): Promise<Communication> {
    return await this.getCommunicationById(id);
  }

  async update(
    id: string,
    data: Prisma.CommunicationUpdateInput,
  ): Promise<Communication> {
    await this.getCommunicationById(id);
    return this.prisma.communication.update({
      data,
      where: { id },
    });
  }

  async delete(id: string): Promise<Communication> {
    await this.getCommunicationById(id);
    return this.prisma.communication.update({
      data: { deletedAt: new Date() },
      where: { id },
    });
  }

  private async getCommunicationById(id: string): Promise<Communication> {
    const communication = await this.prisma.communication.findUnique({
      where: { id },
    });
    if (!communication)
      throw new BadRequestException('Communication is not found');
    if (communication.deletedAt)
      throw new BadRequestException('Communication is deleted');
    return communication;
  }
}
