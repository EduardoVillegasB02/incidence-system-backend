import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateIncidenceDto {
  @ApiProperty({
    example: 'C202545632',
    description: 'Código de la incidencia',
    required: false,
  })
  @IsOptional()
  code?: string;

  @ApiProperty({
    example: 'Reporte de evento en Zona A',
    description: 'Nombre de la incidencia',
  })
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Descripcion opcional',
    description: 'Descripción opcional de la incidencia',
  })
  @IsNotEmpty()
  description?: string;

  @ApiProperty({
    example: '2025-06-10T08:30:00Z',
    description: 'Fecha y hora de la incidencia en formato ISO 8601',
  })
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({
    example: '-12.046374',
    description: 'Latitud de la incidencia',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  latitude?: string;

  @ApiProperty({
    example: '-77.042793',
    description: 'Longitud de la incidencia',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  longitude?: string;

  @ApiProperty({
    example: '3a0210a8-f1db-45d9-b007-ce5adca50426',
    description: 'communication id of the record',
  })
  @IsNotEmpty()
  @IsUUID()
  communicationId: string;

  @ApiProperty({
    example: '3a0210a8-f1db-45d9-b007-ce5adca50426',
    description: 'crime id',
  })
  @IsNotEmpty()
  @IsUUID()
  crimeId: string;

  @ApiProperty({
    example: '3a0210a8-f1db-45d9-b007-ce5adca50426',
    description: 'zone id of the record',
  })
  @IsNotEmpty()
  @IsUUID()
  zoneId: string;
}
