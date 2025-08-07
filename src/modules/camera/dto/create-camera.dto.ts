import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsObject,
  ValidateIf,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateCameraDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  direction: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsObject()
  @IsNotEmpty()
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };

  @IsString()
  @IsNotEmpty()
  cameraType: string;

  @IsBoolean()
  megaphone: boolean;

  @IsBoolean()
  panicButton: boolean;

  @IsBoolean()
  cameraMunicipal: boolean;

  @ValidateIf((o) => o.direction !== '360')
  @IsObject()
  @IsNotEmpty()
  reference: {
    type: 'Point';
    coordinates: [number, number];
  };

  @IsUUID()
  @IsOptional()
  jurisdictionId: string;

  @IsUUID()
  @IsOptional()
  userId: string;
}
