import { Status } from '@prisma/client';
import { UpdateIncidenceDto } from '../dto';

const updateRules: Record<Status, ReadonlyArray<keyof UpdateIncidenceDto>> = {
  previous: [
    'code',
    'name',
    'description',
    'latitude',
    'longitude',
    'date',
    'observation',
    'homeLatitude',
    'homeLongitude',
    'communicationId',
    'crimeId',
    'jurisdictionId',
    'zoneId',
  ],
  process: ['code', 'description', 'latitude', 'longitude', 'observation'],
  completed: ['observation'],
  finished: [],
};

export async function buildUpdateByStatus(
  dto: UpdateIncidenceDto,
  status: Status,
): Promise<Partial<UpdateIncidenceDto>> {
  const allowed = new Set(updateRules[status] ?? []);
  return Object.fromEntries(
    Object.entries(dto).filter(
      ([k, v]) => allowed.has(k as keyof UpdateIncidenceDto) && v !== undefined,
    ),
  ) as Partial<UpdateIncidenceDto>;
}
