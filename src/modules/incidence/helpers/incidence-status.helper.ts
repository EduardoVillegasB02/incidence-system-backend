import { ConflictException } from '@nestjs/common';
import { Incidence } from '@prisma/client';
import { UpdateIncidenceDto } from '../dto';

export async function validateStatus(
  dto: UpdateIncidenceDto,
  incidence: Incidence,
): Promise<void> {
  const code = dto.code ?? incidence.code;
  const status = dto.status ?? incidence.status;
  if (['completed', 'finished'].includes(status) && !code)
    throw new ConflictException(
      'The status cannot be changed to completed or finished without assigning a code to the incident.',
    );
}
