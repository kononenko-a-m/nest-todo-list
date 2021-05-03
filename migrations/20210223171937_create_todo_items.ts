import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('todo_items', (todoItemsTable) => {
    todoItemsTable.bigIncrements('id');
    todoItemsTable.string('title', 255).notNullable();
    todoItemsTable.text('description').nullable();
    todoItemsTable
      .enu('status', ['todo', 'in_progress', 'completed', 'cancelled'], {
        useNative: true,
        enumName: 'todo_item_status',
      })
      .notNullable();
    todoItemsTable.bigInteger('owner_id').nullable();
    todoItemsTable.bigInteger('assigned_user_id').nullable();
    todoItemsTable
      .dateTime('created_at', {
        useTz: true,
      })
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    todoItemsTable
      .dateTime('updated_at', {
        useTz: true,
      })
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));

    todoItemsTable.foreign('owner_id').references('id').inTable('users');
    todoItemsTable
      .foreign('assigned_user_id')
      .references('id')
      .inTable('users');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('DROP TABLE todo_items CASCADE');

  await knex.schema.raw('DROP TYPE IF EXISTS todo_item_status');
}
