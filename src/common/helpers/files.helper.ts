import {
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Evidence } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export function generateFilename(originalName: string): string {
  const ext = path.extname(originalName);
  return `${uuidv4()}${ext}`;
}

export function generateDirectory(configService: ConfigService): any {
  const basePath = configService.get<string>('URL_IMG_PATH');
  if (!basePath)
    throw new InternalServerErrorException(
      'URL_IMG_PATH is not configured in environment variables',
    );
  const currentDate = new Date().toISOString().split('T')[0];
  const uploadDir = path.join(basePath, 'records', currentDate);
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  return { currentDate, uploadDir };
}

export function deleteFile(
  configService: ConfigService,
  filePath: string,
): void {
  const basePath = configService.get<string>('URL_IMG_PATH');
  if (!basePath)
    throw new InternalServerErrorException(
      'URL_IMG_PATH is not configured in environment variables',
    );
  const fullPath = basePath ? path.join(basePath, filePath) : null;
  if (fullPath && fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
}

export function verifyUpdateFiles(
  files: Array<Express.Multer.File>,
  evidences: Evidence[],
): void {
  if (!files || files.length === 0) return;
  const total = evidences.length + files.length;
  if (total > 5) throw new ForbiddenException('Only you can upload 5 files');
}
