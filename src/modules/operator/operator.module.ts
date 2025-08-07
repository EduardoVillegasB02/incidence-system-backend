import { Module } from '@nestjs/common';
import { OperatorController } from './operator.controller';
import { UserService } from '../user/user.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [OperatorController],
  providers: [UserService, PrismaService],
})
export class OperatorModule {}
