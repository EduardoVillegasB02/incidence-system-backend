import { ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

export async function validateCode(
  prisma: PrismaService,
  code: string | undefined,
): Promise<void> {
  if (!code) return;
  const incident = await prisma.incidence.findUnique({
    where: { code },
  });
  if (!incident) return;
  if (code === incident.code) return;
  if (incident.deletedAt)
    throw new ConflictException(
      'This code belongs to a deleted incident. Please restore it or use a different one.',
    );
  throw new ConflictException('An incident with this code already exists.');
}
