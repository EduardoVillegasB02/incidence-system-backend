import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { UserType } from '../../../common/enums';

export class CreateAssignmentDto {
  @ApiProperty({
    description: 'UUID of the hunter-operator being assigned to the incidence',
    example: 'd3b07384-d9a5-4bd2-b72d-e4f3c2a5b11c',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'UUID of the incidence to which the operator is assigned',
    example: 'f1c8b9a1-8f84-4bde-9e94-91cd7cf7e5ac',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  incidenceId: string;

  @ApiProperty({
    description: 'Type of user',
    enum: UserType,
    example: UserType.hunter,
    required: true,
  })
  @IsEnum(UserType)
  @IsNotEmpty()
  userType: string;
}
