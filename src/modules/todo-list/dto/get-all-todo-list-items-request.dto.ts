import { IsIn } from 'class-validator';

import {
  PaginatedDataView,
  SortedDataView,
  SortFields,
  toSortValidFields,
} from '../../../common/data-view';
import { ApiPropertyOptional } from '@nestjs/swagger';

type GetAllTodoListItemsDataViewSort = SortFields<'createdAt' | 'updatedAt'>;

export class GetAllTodoListItemsRequestDto
  extends PaginatedDataView
  implements SortedDataView<GetAllTodoListItemsDataViewSort> {
  @ApiPropertyOptional()
  ownerId?: number;

  @ApiPropertyOptional()
  assignedUserId?: number;

  @ApiPropertyOptional({
    enum: toSortValidFields('createdAt', 'updatedAt'),
  })
  @IsIn(toSortValidFields('createdAt', 'updatedAt'))
  sort?: GetAllTodoListItemsDataViewSort;
}
