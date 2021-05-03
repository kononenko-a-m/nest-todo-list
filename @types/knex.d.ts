// knex.d.ts

import * as Knex from 'knex';
import type {
  PaginatedDataView,
  SortedDataView,
} from '../src/common/data-view';

declare module 'knex' {
  interface QueryBuilder {
    paginateDataView<TRecord extends {} = any, TResult = unknown[]>(
      paginatedDataView: PaginatedDataView,
    ): QueryBuilder<TRecord, TResult>;

    sortDataView<TRecord extends {} = any, TResult = unknown[]>(
      sortedDataView: SortedDataView<string>,
    ): QueryBuilder<TRecord, TResult>;
  }
}
