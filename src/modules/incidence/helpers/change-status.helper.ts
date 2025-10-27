import { BadRequestException } from '@nestjs/common';
import { Status } from '@prisma/client';

export function validateNextStatus(
  previousStatus: Status,
  nextStatus: Status,
  code: string | null,
): void {
  const transition: Record<Status, Status | null> = {
    previous: 'process',
    process: 'completed',
    completed: 'finished',
    finished: null,
  };
  const expectedStatus = transition[previousStatus];
  if (!expectedStatus) throw new BadRequestException('Invalid current status');
  if (expectedStatus !== nextStatus)
    throw new BadRequestException(
      `Invalid transition: ${previousStatus} can only move to ${expectedStatus}`,
    );
  if (nextStatus === Status.completed && !code)
    throw new BadRequestException(
      'Cannot change status to completed without assigning a code to the incident',
    );
}
