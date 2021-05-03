import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { KnexService } from '../../common/knex';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private knexService: KnexService,
  ) {}

  @Get()
  @HealthCheck()
  getHealth() {
    return this.health.check([
      () =>
        this.knexService
          .isAlive()
          .then(() => ({ database: { status: 'up' as const } }))
          .catch(() => ({ database: { status: 'down' as const } })),
    ]);
  }
}
