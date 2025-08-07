import { Module } from '@nestjs/common';
import { CameraService } from './camera.service';
import { CameraController } from './camera.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [CameraController],
  providers: [CameraService, PrismaService],
  exports: [CameraService],
})
export class CameraModule {}
