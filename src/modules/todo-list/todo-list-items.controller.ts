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
import { CurrentUser, JwtAuthGuard, User } from '../user';
import { TodoListItemsService } from './todo-list-items.service';
import { GetAllTodoListItemsRequestDto } from './dto/get-all-todo-list-items-request.dto';
import { CreateTodoListItemDto } from './dto/create-todo-list-item.dto';
import { UpdateTodoListItemDto } from './dto/update-todo-list-item.dto';
import { TodoListNotFoundErrorFilter } from './error-filter/todo-list-not-found.error-filter';

@Controller('todo-list/:slug/items')
@UseFilters(new TodoListNotFoundErrorFilter())
export class TodoListItemsController {
  constructor(private todoListItemsService: TodoListItemsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  postTodoList(
    @CurrentUser() user: User,
    @Param('slug') slug: string,
    @Body() createTodoListItemDto: CreateTodoListItemDto,
  ) {
    return this.todoListItemsService.createTodoListItem(
      user,
      slug,
      createTodoListItemDto,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getTodoListItems(
    @CurrentUser() currentUser: User,
    @Param('slug') slug: string,
    @Query() getAllTodoListItemsRequestDto: GetAllTodoListItemsRequestDto,
  ) {
    return this.todoListItemsService.getTodoLists(
      currentUser,
      slug,
      getAllTodoListItemsRequestDto,
    );
  }

  @Patch(':itemId')
  @UseGuards(JwtAuthGuard)
  updateTodoListItem(
    @CurrentUser() currentUser: User,
    @Param('slug') slug: string,
    @Param('itemId') itemId: number,
    @Body() updateTodoListItemDto: UpdateTodoListItemDto,
  ) {
    return this.todoListItemsService.updateTodoList(
      currentUser,
      slug,
      itemId,
      updateTodoListItemDto,
    );
  }

  @Delete(':itemId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTodoListItem(
    @CurrentUser() currentUser: User,
    @Param('slug') slug: string,
    @Param('itemId') itemId: number,
  ) {
    await this.todoListItemsService.deleteTodoListBySlugAndId(
      currentUser,
      slug,
      itemId,
    );
  }
}
