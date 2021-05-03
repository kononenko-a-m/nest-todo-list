import { MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoListItemDto {
  @ApiProperty({
    required: true,
    minLength: 3,
    maxLength: 255,
  })
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @ApiProperty({
    required: true,
    maxLength: 65535,
    nullable: true,
  })
  @MaxLength(65535)
  description: string | null;
}
