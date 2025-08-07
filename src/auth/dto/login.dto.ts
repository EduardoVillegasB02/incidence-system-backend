import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john_doe', description: 'Username for login' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123', description: 'Password for login' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
