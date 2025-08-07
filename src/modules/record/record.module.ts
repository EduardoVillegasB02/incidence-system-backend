import { Module } from '@nestjs/common';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { CameraModule } from '../camera/camera.module';
import { IncidenceModule } from '../incidence/incidence.module';
import { EvidenceService } from '../evidence/evidence.service';

@Module({
  imports: [CameraModule, IncidenceModule],
  controllers: [RecordController],
  providers: [RecordService, PrismaService, EvidenceService, UserService],
})
export class RecordModule {}
