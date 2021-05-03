import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (usersTable) => {
    usersTable.bigIncrements('id');
    usersTable.string('name', 255).notNullable();
    usersTable.string('email', 255).notNullable().unique();
    usersTable
      .dateTime('created_at', {
        useTz: true,
      })
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    usersTable
      .dateTime('updated_at', {
        useTz: true,
      })
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  });

  await knex.schema.createTable('user_passwords', (userPasswordsTable) => {
    userPasswordsTable.bigInteger('user_id').notNullable().unique();
    userPasswordsTable.string('password').notNullable();

    userPasswordsTable.foreign('user_id').references('id').inTable('users');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('DROP TABLE user_passwords CASCADE');

  await knex.schema.raw('DROP TABLE users CASCADE');
}
