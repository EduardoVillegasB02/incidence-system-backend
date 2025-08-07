import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaginationDto } from '../../../common/dto';

export class FilterIncidenceDto extends PaginationDto {
  @ApiProperty({
    description: 'Fecha de inicio del rango',
    example: '2025-07-05',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  start?: string;

  @ApiProperty({
    description: 'Fecha de fin del rango',
    example: '2025-07-05',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  end?: string;

  @ApiProperty({
    description: 'ID del crimen de la incidencia',
    example: [
      '177e8bf2-a0a1-491d-9de5-112f1fb7ec30',
      '3b15aa6e-4574-4986-8b36-7aa146cc7aa6',
    ],
    required: false,
    isArray: true,
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
        return [value];
      } catch {
        return [value];
      }
    }
    if (Array.isArray(value)) return value;
    return [];
  })
  @IsArray()
  @IsUUID('all', { each: true })
  crimeIds?: string[];

  @ApiProperty({
    description: 'Código de incidencia',
    example: 'C202538434',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Estado',
    enum: Status,
    example: Status.completed,
    required: false,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
