import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { KnexModule } from './common/knex';
import { UserModule } from './modules/user';
import { loadConfiguration } from './common/config/configuration-loader';
import { HealthModule } from './modules/health';
import { TodoListModule } from './modules/todo-list/todo-list.module';
import { SecurityModule } from './common/security/security.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [loadConfiguration],
    }),
    KnexModule,
    SecurityModule,
    UserModule,
    TodoListModule,
    HealthModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
  ],
})
export class AppModule {}
