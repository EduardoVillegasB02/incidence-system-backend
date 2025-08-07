import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRecordDto {
  @ApiProperty({
    example: 'Se observó al sospechoso dirigiéndose hacia la zona norte',
    description: 'Description of the record',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: '2025-06-10T08:55:00Z',
    description: 'Datetime of the record',
    required: false,
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    example: '3a0210a8-f1db-45d9-b007-ce5adca50426',
    description: 'Camera id of the record',
    required: false,
  })
  @IsUUID()
  cameraId: string;

  @ApiProperty({
    example: 'cb624b5d-a6e9-42cf-9396-e1ecfef30f9c',
    description: 'Incidence id of the record',
    required: false,
  })
  @IsUUID()
  incidenceId: string;
}
