import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Evidence, Incidence, Record, Status } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../../prisma/prisma.service';
import {
  deleteFile,
  generateDirectory,
  generateFilename,
} from '../../common/helpers';

@Injectable()
export class EvidenceService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async create(files: Express.Multer.File[], recordId: string) {
    const { currentDate, uploadDir } = generateDirectory(this.configService);
    const dataToCreate = files.map((file) => {
      const uniqueName = generateFilename(file.originalname);
      const filePath = path.join(uploadDir, uniqueName);
      fs.writeFileSync(filePath, file.buffer);
      return {
        path: `records/${currentDate}/${uniqueName}`,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        recordId,
      };
    });
    return await this.prisma.evidence.createMany({
      data: dataToCreate,
    });
  }

  async delete(id: string) {
    const evidence = await this.getEvidenceById(id);
    if (evidence.record.incidence.status != Status.process)
      throw new ConflictException(
        'The incident has been completed, you cannot make changes',
      );
    deleteFile(this.configService, evidence.path);
    return this.prisma.evidence.update({
      data: { deletedAt: new Date() },
      where: { id },
    });
  }

  private async getEvidenceById(
    id: string,
  ): Promise<Evidence & { record: Record & { incidence: Incidence } }> {
    const evidence = await this.prisma.evidence.findUnique({
      where: { id },
      include: { record: { include: { incidence: true } } },
    });
    if (!evidence) throw new BadRequestException('Evidence is not found');
    if (evidence.deletedAt)
      throw new BadRequestException('Evidence is deleted');
    return evidence;
  }
}
