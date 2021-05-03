import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthStrategy } from './auth.strategy';
import { UserRepository } from './user.repository';
import { KnexModule } from '../../common/knex';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';

@Module({
  imports: [
    ConfigModule,
    KnexModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get<JwtModuleOptions>('authorization.jwt'),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [UserService, AuthStrategy, UserRepository, JwtAuthGuard],
})
export class UserModule {}
