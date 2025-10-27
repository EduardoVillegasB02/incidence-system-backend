import { addDays, differenceInCalendarDays } from 'date-fns';
import { Trend } from '../types';

export function getTrendsTemplate(
  startDate: Date,
  endDate: Date,
  fields: any[],
) {
  const daysCount = differenceInCalendarDays(endDate, startDate);
  const crimeZeros = toZeroCounts(fields);
  const trendsTemplate: Trend = {
    totalAssigned: 0,
    totalFinished: 0,
    days: [],
  };
  for (let i = 0; i < daysCount; i++)
    trendsTemplate.days.push({
      date: addDays(startDate, i).toISOString().split('T')[0],
      assigned: 0,
      finished: 0,
      crimen: crimeZeros,
      hours: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        assigned: 0,
        finished: 0,
        crimen: crimeZeros,
      })),
    });
  return trendsTemplate;
}

function toZeroCounts(fields: string[]): Record<string, number> {
  return Object.fromEntries(
    [...new Set(fields.filter(Boolean))].map((k) => [k, 0]),
  );
}

export function makeCrimen(fields: string[]): Record<string, number> {
  return Object.fromEntries(fields.map((f) => [f, 0])) as Record<
    string,
    number
  >;
}
