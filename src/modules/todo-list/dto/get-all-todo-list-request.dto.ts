import { IsIn } from 'class-validator';

import {
  PaginatedDataView,
  SortedDataView,
  SortFields,
  toSortValidFields,
} from '../../../common/data-view';
import { ApiPropertyOptional } from '@nestjs/swagger';

type GetAllTodoListDataViewSort = SortFields<'createdAt' | 'updatedAt'>;

export class GetAllTodoListRequestDto
  extends PaginatedDataView
  implements SortedDataView<GetAllTodoListDataViewSort> {
  @ApiPropertyOptional()
  ownerId?: number;

  @ApiPropertyOptional({
    enum: toSortValidFields('createdAt', 'updatedAt'),
  })
  @IsIn(toSortValidFields('createdAt', 'updatedAt'))
  sort?: GetAllTodoListDataViewSort;
}
