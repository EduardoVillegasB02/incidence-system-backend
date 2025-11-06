import { FilterIncidenceDto } from '../dto';

export function buildWhereIncidence(
  filters: FilterIncidenceDto,
  incidencesId: string[],
) {
  const { start, end, crimeIds, search, status } = filters;
  const where: any = { deletedAt: null };
  if (search)
    where.OR = [
      { code: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
      { plate: { contains: search, mode: 'insensitive' } },
    ];
  if (crimeIds && crimeIds.length) where.crimeId = { in: crimeIds };
  if (start && end)
    where.date = {
      gte: new Date(`${start}T00:00:00`),
      lte: new Date(`${end}T23:59:59`),
    };
  else if (start)
    where.date = {
      gte: new Date(`${start}T00:00:00`),
    };
  else if (end)
    where.date = {
      lte: new Date(`${end}T23:59:59`),
    };
  if (incidencesId) where.id = { in: incidencesId };
  if (status) where.status = status;
  return where;
}

export const includeIncidence = {
  communication: true,
  crime: true,
  records: {
    where: { deletedAt: null },
    include: {
      camera: true,
      evidences: {
        where: { deletedAt: null }
      },
      user: true,
    },
  },
  user: {
    select: {
      id: true,
      name: true,
      lastname: true,
      dni: true,
      phone: true,
      username: true,
    },
  },
  zone: true,
};
