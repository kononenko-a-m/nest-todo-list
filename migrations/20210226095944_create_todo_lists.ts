import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('todo_lists', (todoListTable) => {
    todoListTable.bigIncrements('id');
    todoListTable.string('slug', 255).notNullable().unique();
    todoListTable.string('title', 255).notNullable();
    todoListTable.text('description').nullable();

    todoListTable.bigInteger('owner_id').nullable();

    todoListTable
      .dateTime('created_at', {
        useTz: true,
      })
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    todoListTable
      .dateTime('updated_at', {
        useTz: true,
      })
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));

    todoListTable.foreign('owner_id').references('id').inTable('users');
  });

  await knex.schema.alterTable('todo_items', (todoItemsTable) => {
    todoItemsTable
      .bigInteger('todo_list_id')
      .notNullable()
      .after('description');

    todoItemsTable
      .foreign('todo_list_id')
      .references('id')
      .inTable('todo_lists');

    todoItemsTable.unique(['todo_list_id', 'title']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('todo_items', (todoItemsTable) => {
    todoItemsTable.dropUnique(['todo_list_id', 'title']);
    todoItemsTable.dropColumn('todo_list_id');
  });

  await knex.schema.raw('DROP TABLE todo_lists CASCADE');
}
