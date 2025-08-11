import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { EvidenceService } from './evidence.service';
import { Response } from 'express';
import { JwtAuthGuard, RolesGuard } from '../../auth/guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('evidence')
export class EvidenceController {
  constructor(private readonly evidenceService: EvidenceService) {}

  @Get('*path')
  getFile(@Param('path') path: string[] | string, @Res() res: Response) {
    const filePath = this.evidenceService.getFile(path);
    return res.sendFile(filePath);
  }
}
