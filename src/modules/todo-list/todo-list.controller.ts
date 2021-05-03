import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, User } from '../user';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { GetAllTodoListRequestDto } from './dto/get-all-todo-list-request.dto';
import { TodoListService } from './todo-list.service';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';
import { ApiAuthorizationHeaderDecorator } from '../user/api-authorization-header.decorator';
import { TodoListNotFoundErrorFilter } from './error-filter/todo-list-not-found.error-filter';
import { TodoList } from './todo-list.model';

@UseFilters(new TodoListNotFoundErrorFilter())
@Controller('todo-list')
export class TodoListController {
  constructor(private todoListService: TodoListService) {}

  @Post()
  @ApiAuthorizationHeaderDecorator()
  @ApiOkResponse({
    type: TodoList,
  })
  @UseGuards(JwtAuthGuard)
  postTodoList(
    @CurrentUser() user: User,
    @Body() createTodoListDto: CreateTodoListDto,
  ): Promise<TodoList> {
    return this.todoListService.createTodoList(user, createTodoListDto);
  }

  @Get()
  @ApiAuthorizationHeaderDecorator()
  @ApiOkResponse({
    type: TodoList,
    isArray: true,
  })
  @ApiForbiddenResponse({
    description:
      'Current user has no access to view todo list of the requested user',
  })
  @UseGuards(JwtAuthGuard)
  getAllTodoList(
    @CurrentUser() user: User,
    @Query() getAllTodoListRequestDto: GetAllTodoListRequestDto,
  ) {
    return this.todoListService.getTodoLists(user, getAllTodoListRequestDto);
  }

  @Get(':slug')
  @ApiAuthorizationHeaderDecorator()
  @ApiForbiddenResponse({
    description:
      'Current user has no access to view todo list of the requested user',
  })
  @UseGuards(JwtAuthGuard)
  getTodoList(@CurrentUser() user: User, @Param('slug') slug: string) {
    return this.todoListService.getTodoListBySlug(user, slug);
  }

  @Patch(':slug')
  @ApiForbiddenResponse({
    description:
      'Current user has no access to change todo list of the requested user',
  })
  @ApiAuthorizationHeaderDecorator()
  @UseGuards(JwtAuthGuard)
  updateTodoList(
    @CurrentUser() user: User,
    @Param('slug') slug: string,
    @Body() updateTodoListDto: UpdateTodoListDto,
  ) {
    return this.todoListService.updateTodoList(user, slug, updateTodoListDto);
  }

  @Delete(':slug')
  @ApiForbiddenResponse({
    description:
      'Current user has no access to delete todo list of the requested user',
  })
  @ApiAuthorizationHeaderDecorator()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTodoList(@CurrentUser() user: User, @Param('slug') slug: string) {
    await this.todoListService.deleteTodoListBySlug(user, slug);
  }
}
