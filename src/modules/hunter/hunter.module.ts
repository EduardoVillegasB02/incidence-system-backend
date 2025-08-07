import { Module } from '@nestjs/common';
import { HunterController } from './hunter.controller';
import { UserService } from '../user/user.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [HunterController],
  providers: [UserService, PrismaService],
})
export class HunterModule {}
