import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { SecurityErrorFilter } from './security.error-filter';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: SecurityErrorFilter,
    },
  ],
})
export class SecurityModule {}
