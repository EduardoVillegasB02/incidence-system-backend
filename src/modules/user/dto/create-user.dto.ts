import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Michael',
    description: 'Name of the user',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(25)
  name: string;

  @ApiProperty({
    example: 'Vargas',
    description: 'Lastname of the user',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(25)
  lastname: string;

  @ApiProperty({
    example: '945636875',
    description: 'Phone of the user',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: '72349999',
    description: 'DNI of the user',
  })
  @Matches(/^[0-9]{8}$/)
  dni?: string;

  @ApiProperty({
    example: 'michael',
    description: 'Username for the user',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'password$$123',
    description: 'Password for the user',
  })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$%&#]).+$/, {
    message:
      'The password must include at least one uppercase letter, one lowercase letter, one number, and one special character: $, %, &, or #',
  })
  password: string;
}
