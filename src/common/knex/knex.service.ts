import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as knex from 'knex';

import { PaginatedDataView, SortedDataView } from '../data-view';

knex.QueryBuilder.extend(
  'paginateDataView',
  function (paginatedDataView: PaginatedDataView) {
    return this.offset(paginatedDataView.offset).limit(paginatedDataView.limit);
  },
);

knex.QueryBuilder.extend(
  'sortDataView',
  function (sortedDataView: SortedDataView<string>) {
    if (sortedDataView.sort) {
      const isDesc = sortedDataView.sort.startsWith('-');
      const sortField = isDesc
        ? sortedDataView.sort.substr(1)
        : sortedDataView.sort;

      return this.orderBy(sortField, isDesc ? 'desc' : 'asc');
    } else {
      return this;
    }
  },
);

@Injectable()
export class KnexService {
  private readonly config: knex.Config;
  private readonly logger = new Logger(KnexService.name);

  private _knexConnection: knex<unknown, unknown>;

  constructor(private configService: ConfigService) {
    this.config = this.configService.get<knex.Config>('knex');
  }

  getKnex() {
    if (!this._knexConnection) {
      this._knexConnection = knex({
        ...this.config,
        log: {
          warn(message) {
            this.logger.warn(message);
          },
          error(message) {
            this.logger.error(message);
          },
          deprecate(message) {
            this.logger.warn(message);
          },
          debug(message) {
            this.logger.debug(message);
          },
        },
      });
    }

    return this._knexConnection;
  }

  isAlive() {
    return this.getKnex().raw('SELECT 1').timeout(5000, { cancel: true });
  }
}
