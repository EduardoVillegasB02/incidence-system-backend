import { Module } from '@nestjs/common';
import { SupervisorController } from './supervisor.controller';
import { UserService } from '../user/user.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [SupervisorController],
  providers: [UserService, PrismaService],
})
export class SupervisorModule {}
