import { Module } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { IncidenceModule } from '../incidence/incidence.module';

@Module({
  imports: [IncidenceModule],
  controllers: [AssignmentController],
  providers: [AssignmentService, PrismaService, UserService],
  exports: [AssignmentService],
})
export class AssignmentModule {}
