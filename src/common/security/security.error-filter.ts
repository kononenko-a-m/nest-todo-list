import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { NoAccessError } from './error';

@Catch(NoAccessError)
export class SecurityErrorFilter implements ExceptionFilter {
  catch(exception: NoAccessError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.FORBIDDEN).json({
      error: 'NO_ACCESS',
    });
  }
}
