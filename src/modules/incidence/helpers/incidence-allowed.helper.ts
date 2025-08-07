import { Role } from '@prisma/client';
import { ForbiddenException } from '@nestjs/common';
import { UpdateIncidenceDto } from '../dto';
import { AllowedField } from '../../../common/enums';

export async function verifyFields(
  dto: UpdateIncidenceDto,
  role: Role,
): Promise<void> {
  const allowed = Object.values(AllowedField);
  if (
    ['hunter', 'operator'].includes(role) &&
    Object.keys(dto).some((k) => !allowed.includes(k as AllowedField))
  )
    throw new ForbiddenException(
      `Only you can edit these fields: ${allowed.join(', ')}`,
    );
}
