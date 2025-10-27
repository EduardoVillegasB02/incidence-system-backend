import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateIncidenceDto } from './create-incidence.dto';

export class UpdateIncidenceDto extends PartialType(CreateIncidenceDto) {
  @ApiProperty({
    example: 'The incident was rejected on the grounds of a false alarm',
    description: 'Observación para justificar el cambio de estado',
    required: false,
  })
  @IsString()
  @IsOptional()
  observation?: string;
}
