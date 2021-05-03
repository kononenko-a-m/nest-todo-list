import { Injectable } from '@nestjs/common';
import { TodoListRepository } from './todo-list.repository';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { User } from '../user';
import { TodoList } from './todo-list.model';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';
import { GetAllTodoListRequestDto } from './dto/get-all-todo-list-request.dto';
import { NoAccessError } from '../../common/security/error';
import { TodoListNotFoundError } from './error/todo-list-not-found-error';

@Injectable()
export class TodoListService {
  constructor(private todoListRepository: TodoListRepository) {}

  async createTodoList(
    subjectUser: User,
    createTodoListDto: CreateTodoListDto,
  ): Promise<TodoList> {
    const todoListId = await this.todoListRepository.createTodoList(
      subjectUser,
      createTodoListDto,
    );
    return this.todoListRepository.getTodoListById(todoListId);
  }

  getTodoLists(
    subjectUser: User,
    getAllTodoListRequest: GetAllTodoListRequestDto,
  ): Promise<TodoList[]> {
    if (subjectUser.id !== getAllTodoListRequest.ownerId) {
      throw new NoAccessError(
        String(subjectUser.id),
        `view user ${getAllTodoListRequest.ownerId} todo list`,
      );
    }

    return this.todoListRepository.getTodoList(getAllTodoListRequest);
  }

  async getTodoListBySlug(subjectUser: User, slug: string): Promise<TodoList> {
    const todoList = await this.alwaysGetTodoListBySlug(slug);

    if (subjectUser.id !== todoList.owner.id) {
      throw new NoAccessError(
        String(subjectUser.id),
        `view user ${todoList.owner.id} todo list`,
      );
    }

    return todoList;
  }

  async deleteTodoListBySlug(subjectUser: User, slug: string) {
    const todoList = await this.alwaysGetTodoListBySlug(slug);

    if (subjectUser.id !== todoList.owner.id) {
      throw new NoAccessError(
        String(subjectUser.id),
        `delete user ${todoList.owner.id} todo list`,
      );
    }

    await this.todoListRepository.deleteTodoListBySlug(slug);
  }

  async updateTodoList(
    subjectUser: User,
    slug: string,
    updateTodoListDto: UpdateTodoListDto,
  ): Promise<TodoList> {
    const todoList = await this.alwaysGetTodoListBySlug(slug);

    if (subjectUser.id !== todoList.owner.id) {
      throw new NoAccessError(
        String(subjectUser.id),
        `change user ${todoList.owner.id} todo list`,
      );
    }

    await this.todoListRepository.updateTodoListBySlug(slug, updateTodoListDto);
    return this.todoListRepository.getTodoListBySlug(slug);
  }

  private async alwaysGetTodoListBySlug(slug: string): Promise<TodoList> {
    const todoList = await this.todoListRepository.getTodoListBySlug(slug);

    if (todoList === null) {
      throw new TodoListNotFoundError(slug);
    }

    return todoList;
  }
}
