import { BadRequestException, Injectable } from '@nestjs/common';
import { Assignment, User } from '@prisma/client';
import { CreateAssignmentDto } from './dto';
import { PrismaService } from '../../prisma/prisma.service';
import { IncidenceService } from '../incidence/incidence.service';
import { UserService } from '../user/user.service';
import { assignmentInclude } from './constants';

@Injectable()
export class AssignmentService {
  constructor(
    private prisma: PrismaService,
    private incidenceService: IncidenceService,
    private userService: UserService,
  ) {}

  async create(dto: CreateAssignmentDto, assigner: any): Promise<Assignment> {
    const { incidenceId, userId, userType } = dto;
    const { userId: assignerId } = assigner;
    const user = await this.verifyFields(incidenceId, userId);
    if (userType !== user.role)
      throw new BadRequestException(`You need to assign a ${user.role}`);
    return await this.prisma.assignment.create({
      data: { assignerId, incidenceId, userId },
    });
  }

  async findAllByIncidence(incidenceId: string): Promise<Assignment[]> {
    return await this.prisma.assignment.findMany({
      where: { incidenceId, deletedAt: null },
      include: assignmentInclude,
      orderBy: { user: { lastname: 'asc' } },
    });
  }

  async findOne(id: string): Promise<Assignment> {
    return await this.getAssignmentById(id);
  }

  async delete(id: string): Promise<Assignment> {
    await this.getAssignmentById(id);
    return this.prisma.assignment.update({
      data: { deletedAt: new Date() },
      where: { id },
    });
  }

  private async getAssignmentById(id: string): Promise<Assignment> {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
    });
    if (!assignment) throw new BadRequestException('Assignment is not found');
    if (assignment.deletedAt)
      throw new BadRequestException('Assignment is deleted');
    return assignment;
  }

  private async verifyFields(
    incidenceId: string,
    userId: string,
  ): Promise<User> {
    const user = await this.userService.findOne(userId);
    await this.incidenceService.getIncidenceById(incidenceId);
    const assignment = await this.prisma.assignment.findFirst({
      where: { userId, incidenceId, deletedAt: null },
    });
    if (assignment)
      throw new BadRequestException(
        'The user is already assigned to this incident',
      );
    return user;
  }
}
