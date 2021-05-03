import { IsOptional, IsPositive, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTodoListItemDto {
  @ApiPropertyOptional({
    minLength: 3,
    maxLength: 255,
    nullable: true,
  })
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  title?: string | null;

  @ApiPropertyOptional({
    maxLength: 65535,
    nullable: true,
  })
  @IsOptional()
  @MaxLength(65535)
  description?: string | null;

  @ApiPropertyOptional({
    nullable: true,
  })
  @IsOptional()
  @IsPositive()
  ownerId?: number | null;

  @ApiPropertyOptional({
    nullable: true,
  })
  @IsOptional()
  @IsPositive()
  assignedUserId?: number | null;
}
