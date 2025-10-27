import { Role, Status } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export async function assignHunter(
  prisma: PrismaService,
): Promise<string | null> {
  const hunters = await prisma.user.findMany({
    where: { role: Role.hunter, deletedAt: null },
    include: {
      assignments: {
        where: {
          incidence: { deletedAt: null, status: { not: Status.finished } },
        },
      },
    },
  });
  if (!hunters.length) return null;
  const hunter = hunters.reduce((prev: any, curr: any) =>
    prev.assignments.length <= curr.assignments.length ? prev : curr,
  );
  if (hunter.assignments.length >= 5) return null;
  return hunter.id;
}
