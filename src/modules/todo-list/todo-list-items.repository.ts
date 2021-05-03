import { Injectable } from '@nestjs/common';
import {
  groupJoins,
  KnexService,
  querySelectFieldInTable,
} from '../../common/knex';
import { User, UserRepository } from '../user';
import { TodoList } from './todo-list.model';
import { CreateTodoListItemDto } from './dto/create-todo-list-item.dto';
import { UpdateTodoListItemDto } from './dto/update-todo-list-item.dto';
import { GetAllTodoListItemsRequestDto } from './dto/get-all-todo-list-items-request.dto';
import { TodoListItemNotFoundError } from './error/todo-list-item-not-found-error';
import { TodoListItem } from './todo-list-item.model';

@Injectable()
export class TodoListItemsRepository {
  static readonly TODO_LIST_ITEMS_TABLE = 'todo_items';
  static readonly SELECT_TODO_LIST_ITEM_RECORD_VIEW = {
    id: 'id',
    title: 'title',
    status: 'status',
    description: 'description',
    todoListId: 'todo_list_id',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  constructor(private knexService: KnexService) {}

  async createTodoListItem(
    owner: User,
    todoList: TodoList,
    createTodoListItemDto: CreateTodoListItemDto,
  ): Promise<number> {
    const todoListItemId = await this.todoListItemsTable()
      .insert({
        ...createTodoListItemDto,
        owner_id: owner.id,
        todo_list_id: todoList.id,
        assigned_user_id: null,
      })
      .returning('id')
      .into(TodoListItemsRepository.TODO_LIST_ITEMS_TABLE);

    return todoListItemId[0];
  }

  async updateTodoListById(
    todoList: TodoList,
    todoListItemId: number,
    { ownerId, assignedUserId, ...todoListUpdate }: UpdateTodoListItemDto,
  ) {
    let updateQuery = this.todoListItemsTable()
      .where({
        id: todoListItemId,
        todo_list_id: todoList.id,
      })
      .update(todoListUpdate);

    if (ownerId) {
      updateQuery = updateQuery.update({
        owner_id: ownerId,
      });
    }

    if (assignedUserId) {
      updateQuery = updateQuery.update({
        assigned_user_id: assignedUserId,
      });
    }

    await updateQuery;
  }

  async deleteTodoListById(todoList: TodoList, todoListItemId: number) {
    await this.todoListItemsTable()
      .where({ id: todoListItemId, todo_list_id: todoList.id })
      .del();
  }

  async getTodoListItemById(todoListItemId: number): Promise<TodoListItem> {
    const todoListRecords = await this.selectTodoListItems().where({
      [`${TodoListItemsRepository.TODO_LIST_ITEMS_TABLE}.id`]: todoListItemId,
    });

    if (!todoListRecords.length) {
      throw new TodoListItemNotFoundError(todoListItemId);
    }

    return groupJoins(todoListRecords[0]) as TodoListItem;
  }

  async getTodoListItems(
    todoList: TodoList,
    getAllTodoListItemsRequestDto: GetAllTodoListItemsRequestDto,
  ): Promise<TodoListItem[]> {
    let getTodoListQuery = this.selectTodoListItems()
      .where({
        todo_list_id: todoList.id,
      })
      .sortDataView(getAllTodoListItemsRequestDto)
      .paginateDataView(getAllTodoListItemsRequestDto);

    if (getAllTodoListItemsRequestDto.ownerId) {
      getTodoListQuery = getTodoListQuery.andWhere({
        owner_id: getAllTodoListItemsRequestDto.ownerId,
      });
    }

    if (getAllTodoListItemsRequestDto.assignedUserId) {
      getTodoListQuery = getTodoListQuery.andWhere({
        assigned_user_id: getAllTodoListItemsRequestDto.assignedUserId,
      });
    }

    const todoListRecords = await getTodoListQuery;

    return todoListRecords.map(groupJoins) as TodoListItem[];
  }

  private selectTodoListItems() {
    return this.todoListItemsTable()
      .select({
        ...querySelectFieldInTable(
          TodoListItemsRepository.TODO_LIST_ITEMS_TABLE,
          TodoListItemsRepository.SELECT_TODO_LIST_ITEM_RECORD_VIEW,
        ),
        ...querySelectFieldInTable(
          'ownerTable',
          UserRepository.SELECT_USER_RECORD_VIEW,
          'owner',
        ),
        ...querySelectFieldInTable(
          'assignedUserTable',
          UserRepository.SELECT_USER_RECORD_VIEW,
          'assignedUser',
        ),
      })
      .leftJoin(
        { ownerTable: UserRepository.USER_TABLE },
        `ownerTable.id`,
        `${TodoListItemsRepository.TODO_LIST_ITEMS_TABLE}.owner_id`,
      )
      .leftJoin(
        { assignedUserTable: UserRepository.USER_TABLE },
        `${UserRepository.USER_TABLE}.id`,
        `${TodoListItemsRepository.TODO_LIST_ITEMS_TABLE}.assigned_user_id`,
      );
  }

  private todoListItemsTable() {
    return this.knexService.getKnex()(
      TodoListItemsRepository.TODO_LIST_ITEMS_TABLE,
    );
  }
}
