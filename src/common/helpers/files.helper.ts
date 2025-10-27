import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
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
  const basePath = getBasePath(configService);
  const currentDate = new Date().toISOString().split('T')[0];
  const uploadDir = path.join(basePath, 'records', currentDate);
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  return { currentDate, uploadDir };
}

export function getResolvedFilePath(
  configService: ConfigService,
  dynamicPath: string[] | string,
): string {
  const basePath = getBasePath(configService);
  const sanitizedPath = Array.isArray(dynamicPath)
    ? path.join(...dynamicPath)
    : dynamicPath.replace(/^\/+/, '');
  const fullPath = path.resolve(basePath, sanitizedPath);
  if (!fs.existsSync(fullPath))
    throw new NotFoundException(`File not found : ${sanitizedPath}`);
  return fullPath;
}

export function deleteFile(
  configService: ConfigService,
  filePath: string,
): void {
  const basePath = getBasePath(configService);
  const fullPath = basePath ? path.join(basePath, filePath) : null;
  try {
    if (fullPath && fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  } catch (error) {
    console.error(`Error deleting file: ${filePath}`, error);
  }
}

export function verifyUpdateFiles(
  files: Array<Express.Multer.File>,
  evidences: Evidence[],
): void {
  if (!files || files.length === 0) return;
  const total = evidences.length + files.length;
  if (total > 5)
    throw new ForbiddenException('You can only upload up to 5 files');
}

function getBasePath(configService: ConfigService): string {
  const basePath = configService.get<string>('URL_IMG_PATH');
  if (!basePath)
    throw new InternalServerErrorException(
      'URL_IMG_PATH is not configured in environment variables',
    );
  return basePath;
}
