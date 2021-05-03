export class TodoListNotFoundError extends Error {
  constructor(todoListIdOrSlug: number | string) {
    super(
      `TodoList not found by ${todoListIdOrSlug} ${
        typeof todoListIdOrSlug === 'string' ? 'slug' : 'id'
      }`,
    );
  }
}
