import { Module } from '@nestjs/common';
import { UserModule } from '../user';
import { TodoListController } from './todo-list.controller';
import { TodoListItemsController } from './todo-list-items.controller';
import { TodoListService } from './todo-list.service';
import { TodoListItemsService } from './todo-list-items.service';
import { TodoListRepository } from './todo-list.repository';
import { TodoListItemsRepository } from './todo-list-items.repository';

@Module({
  imports: [UserModule],
  controllers: [TodoListController, TodoListItemsController],
  providers: [
    TodoListService,
    TodoListItemsService,
    TodoListRepository,
    TodoListItemsRepository,
  ],
})
export class TodoListModule {}
