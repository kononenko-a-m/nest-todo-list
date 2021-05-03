import { Injectable } from '@nestjs/common';
import { User } from '../user';
import { TodoList } from './todo-list.model';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';
import { GetAllTodoListRequestDto } from './dto/get-all-todo-list-request.dto';
import { TodoListItemsRepository } from './todo-list-items.repository';
import { TodoListService } from './todo-list.service';
import { CreateTodoListItemDto } from './dto/create-todo-list-item.dto';
import { TodoListItemNotFoundError } from './error/todo-list-item-not-found-error';
import { TodoListItem } from './todo-list-item.model';

@Injectable()
export class TodoListItemsService {
  constructor(
    private todoListService: TodoListService,
    private todoListItemsRepository: TodoListItemsRepository,
  ) {}

  async createTodoListItem(
    subjectUser: User,
    todoListSlug: string,
    createTodoListItemDto: CreateTodoListItemDto,
  ): Promise<TodoListItem> {
    const todoListItemId = await this.todoListItemsRepository.createTodoListItem(
      subjectUser,
      await this.todoListService.getTodoListBySlug(subjectUser, todoListSlug),
      createTodoListItemDto,
    );
    return this.todoListItemsRepository.getTodoListItemById(todoListItemId);
  }

  async getTodoLists(
    subjectUser: User,
    todoListSlug: string,
    getAllTodoListRequest: GetAllTodoListRequestDto,
  ): Promise<TodoListItem[]> {
    return this.todoListItemsRepository.getTodoListItems(
      await this.todoListService.getTodoListBySlug(subjectUser, todoListSlug),
      getAllTodoListRequest,
    );
  }

  async deleteTodoListBySlugAndId(
    subjectUser: User,
    todoListSlug: string,
    todoListItemId: number,
  ) {
    await this.todoListItemsRepository.deleteTodoListById(
      await this.todoListService.getTodoListBySlug(subjectUser, todoListSlug),
      todoListItemId,
    );
  }

  async updateTodoList(
    subjectUser: User,
    todoListSlug: string,
    todoListItemId: number,
    updateTodoListDto: UpdateTodoListDto,
  ): Promise<TodoList> {
    const todoList = await this.todoListService.getTodoListBySlug(
      subjectUser,
      todoListSlug,
    );

    await this.todoListItemsRepository.updateTodoListById(
      todoList,
      todoListItemId,
      updateTodoListDto,
    );

    const todoListItem = await this.todoListItemsRepository.getTodoListItemById(
      todoListItemId,
    );

    if (todoList.id !== todoListItem.todoListId) {
      throw new TodoListItemNotFoundError(todoListItemId);
    }

    return todoListItem;
  }
}
