import { User } from '../user';
import { ApiProperty } from '@nestjs/swagger';

export class TodoList {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string | null;

  @ApiProperty()
  owner: User | null;

  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
