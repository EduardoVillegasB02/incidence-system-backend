import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Role, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, FilterUserDto } from './dto';
import { paginationHelper } from '../../common/helpers';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto, role: Role): Promise<User> {
    return await this.prisma.user.create({
      data: { ...dto, role },
    });
  }

  async findAll(dto: FilterUserDto, role: Role): Promise<any> {
    const { search, ...pagination } = dto;
    const where: any = { role, deletedAt: null };
    if (search)
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { lastname: { contains: search, mode: 'insensitive' } },
        { dni: { contains: search, mode: 'insensitive' } },
      ];
    return await paginationHelper(
      this.prisma.user,
      {
        select: {
          id: true,
          name: true,
          lastname: true,
          dni: true,
          phone: true,
          username: true,
        },
        where,
        orderBy: { lastname: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<User> {
    return await this.getUserById(id);
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    await this.getUserById(id);
    return this.prisma.user.update({
      data,
      where: { id },
    });
  }

  async delete(id: string): Promise<User> {
    await this.getUserById(id);
    return this.prisma.user.update({
      data: { deletedAt: new Date() },
      where: { id },
    });
  }

  private async getUserById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new BadRequestException('User is not found');
    if (user.deletedAt) throw new BadRequestException('User is deleted');
    return user;
  }
}
