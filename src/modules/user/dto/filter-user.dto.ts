import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto';

export class FilterUserDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Search of name or lastname of hunter',
    example: 'Jose',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
