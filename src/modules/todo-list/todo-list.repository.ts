import { Injectable } from '@nestjs/common';

import {
  groupJoins,
  KnexService,
  querySelectFieldInTable,
} from '../../common/knex';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { User, UserRepository } from '../user';
import { GetAllTodoListRequestDto } from './dto/get-all-todo-list-request.dto';
import { TodoList } from './todo-list.model';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';

@Injectable()
export class TodoListRepository {
  static readonly TODO_LIST_TABLE = 'todo_lists';
  static readonly SELECT_TODO_LIST_RECORD_VIEW = {
    id: 'id',
    title: 'title',
    slug: 'slug',
    description: 'description',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  constructor(private knexService: KnexService) {}

  async createTodoList(
    owner: User,
    createTodoListDto: CreateTodoListDto,
  ): Promise<number> {
    const todoListId = await this.todoListTable()
      .insert({
        ...createTodoListDto,
        owner_id: owner.id,
      })
      .returning('id')
      .into(TodoListRepository.TODO_LIST_TABLE);

    return todoListId[0];
  }

  async updateTodoListBySlug(
    todoListSlug: string,
    { ownerId, ...todoListUpdate }: UpdateTodoListDto,
  ) {
    let updateQuery = this.todoListTable()
      .where({
        slug: todoListSlug,
      })
      .update(todoListUpdate);

    if (ownerId) {
      updateQuery = updateQuery.update({
        owner_id: ownerId,
      });
    }

    await updateQuery;
  }

  async deleteTodoListBySlug(todoListSlug: string) {
    await this.todoListTable().where({ slug: todoListSlug }).del();
  }

  async getTodoListById(todoListId: number): Promise<TodoList | null> {
    const todoListRecords = await this.selectTodoList().where({
      [`${TodoListRepository.TODO_LIST_TABLE}.id`]: todoListId,
    });

    if (!todoListRecords.length) {
      return null;
    }

    return Object.assign(new TodoList(), groupJoins(todoListRecords[0]));
  }

  async getTodoListBySlug(slug: string): Promise<TodoList | null> {
    const todoListRecords = await this.selectTodoList().where({
      [`${TodoListRepository.TODO_LIST_TABLE}.slug`]: slug,
    });

    if (!todoListRecords.length) {
      return null;
    }

    return Object.assign(new TodoList(), groupJoins(todoListRecords[0]));
  }

  async getTodoList(
    getAllTodoListRequestDto: GetAllTodoListRequestDto,
  ): Promise<TodoList[]> {
    let getTodoListQuery = this.selectTodoList()
      .sortDataView(getAllTodoListRequestDto)
      .paginateDataView(getAllTodoListRequestDto);

    if (getAllTodoListRequestDto.ownerId) {
      getTodoListQuery = getTodoListQuery.where({
        owner_id: getAllTodoListRequestDto.ownerId,
      });
    }

    const todoListRecords = await getTodoListQuery;

    return todoListRecords.map((todoListRecord) =>
      Object.assign(new TodoList(), groupJoins(todoListRecord)),
    );
  }

  private selectTodoList() {
    return this.todoListTable()
      .select({
        ...querySelectFieldInTable(
          TodoListRepository.TODO_LIST_TABLE,
          TodoListRepository.SELECT_TODO_LIST_RECORD_VIEW,
        ),
        ...querySelectFieldInTable(
          UserRepository.USER_TABLE,
          UserRepository.SELECT_USER_RECORD_VIEW,
          'owner',
        ),
      })
      .leftJoin(
        UserRepository.USER_TABLE,
        `${UserRepository.USER_TABLE}.id`,
        `${TodoListRepository.TODO_LIST_TABLE}.owner_id`,
      );
  }

  private todoListTable() {
    return this.knexService.getKnex()(TodoListRepository.TODO_LIST_TABLE);
  }
}
