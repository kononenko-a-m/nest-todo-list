export class TodoListItemNotFoundError extends Error {
  constructor(todoListItemId: number) {
    super(`TodoList item not found by ${todoListItemId} id`);
  }
}
