import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { NoAccessError } from '../../../common/security/error';
import { TodoListNotFoundError } from '../error/todo-list-not-found-error';

@Catch(TodoListNotFoundError)
export class TodoListNotFoundErrorFilter implements ExceptionFilter {
  catch(exception: NoAccessError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.NOT_FOUND).json({
      error: 'TODO_LIST_NOT_FOUND',
    });
  }
}
