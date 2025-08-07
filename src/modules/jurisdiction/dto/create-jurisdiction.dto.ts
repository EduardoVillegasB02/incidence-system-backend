import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsObject, IsUUID } from 'class-validator';
import { geometryExample } from './examples';

export class CreateJurisdictionDto {
  @ApiProperty({
    example: 'Zarate',
    description: 'Name of the jurisdiction',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Jurisdiction description',
    description: 'Description of the jurisdiction',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: '#FF5733',
    description: 'Color associated with the jurisdiction',
  })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    example: geometryExample,
    description: 'Geographical boundaries of the jurisdiction',
  })
  @IsObject()
  @IsNotEmpty()
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };

  @IsUUID()
  @IsNotEmpty()
  zoneId: string;
}
