import { User } from '../user';

export enum TodoListItemStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface TodoListItem {
  id: number;
  title: string;
  status: TodoListItemStatus;
  todoListId: number;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  owner: User | null;
  assignedUser: User | null;
}
