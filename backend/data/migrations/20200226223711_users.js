
exports.up = knex => {
  return knex.schema.createTable('users', tbl => {
    tbl.increments();
    tbl.string('username', 128).notNullable().unique();
    tbl.string('password', 128).notNullable();
    tbl.integer('balance').unsigned().notNullable();
  })
};

exports.down = knex => {
  return knex.schema.dropTableIfExists('users');
};
