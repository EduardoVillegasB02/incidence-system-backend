import { Role } from '@prisma/client';
import { FilterDashboardDto } from '../dto';

export function whereDashboardIncidence(filters: FilterDashboardDto) {
  const { start, end } = filters;
  const where: any = { deletedAt: null };
  if (start && end)
    where.date = {
      gte: new Date(`${start}T00:00:00.000Z`),
      lte: new Date(`${end}T23:59:59.999Z`),
    };
  else if (start)
    where.date = {
      gte: new Date(`${start}T00:00:00.000Z`),
    };
  else if (end)
    where.date = {
      lte: new Date(`${end}T23:59:59.999Z`),
    };
  return where;
}

export function whereDashboardUser(filters: FilterDashboardDto) {
  const { search, userType } = filters;
  const where: any = {
    deletedAt: null,
    role: { in: [Role.hunter, Role.operator] },
    assignments: {
      some: {
        deletedAt: null,
      },
    },
  };
  if (userType) where.role = userType;
  if (search)
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { lastname: { contains: search, mode: 'insensitive' } },
      { dni: { contains: search, mode: 'insensitive' } },
    ];
  return where;
}
