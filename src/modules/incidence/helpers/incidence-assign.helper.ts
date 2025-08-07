import { ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export async function getIncidencesByAssign(
  prisma: PrismaService,
  role: string,
  userId: string,
  incidenceId: string | null = null,
): Promise<any> {
  if (!['hunter', 'operator'].includes(role)) return null;
  const where = incidenceId ? { incidenceId, userId } : { userId };
  const assignments = await prisma.assignment.findMany({
    where,
    select: { incidenceId: true },
  });
  if (!assignments)
    throw new ForbiddenException('This user has no incidents assigned');
  return assignments.map((assign) => assign.incidenceId);
}
