import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto';
import { UserType } from '../../../common/enums';

export class FilterDashboardDto extends PaginationDto {
  @ApiProperty({
    description: 'Type of user',
    enum: UserType,
    example: UserType.hunter,
    required: true,
  })
  @IsOptional()
  @IsEnum(UserType)
  userType: string;

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
    description: 'Código de incidencia',
    example: 'C202538434',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
