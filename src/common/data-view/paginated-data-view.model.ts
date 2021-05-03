import { IsInt, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDataView {
  @ApiProperty({
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  offset: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  limit: number;
}
