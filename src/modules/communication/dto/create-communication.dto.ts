import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommunicationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
