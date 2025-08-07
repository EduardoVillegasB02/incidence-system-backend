import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCrimeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
