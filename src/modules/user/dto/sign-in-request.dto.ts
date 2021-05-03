import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInRequestDto {
  @ApiProperty({
    required: true,
    format: 'example@gmail.com',
    maxLength: 255,
  })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    required: true,
    minLength: 8,
    maxLength: 255,
  })
  @MinLength(8)
  @MaxLength(255)
  password: string;
}
