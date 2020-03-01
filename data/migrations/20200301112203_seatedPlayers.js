
exports.up = function(knex) {
  return knex.schema.createTable('Seated Players', tbl => {
    tbl.increments();
    tbl.integer('userId').unsigned().notNullable();
    tbl.string('username').notNullable();
    tbl.integer('tableId').unsigned().notNullable();
    tbl.integer('seatId').notNullable();
    tbl.float('tableBalance').notNullable();
    tbl.foreign('userId').references('users.id');
    tbl.foreign('tableId').references('tables.id');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Seated Players');

};
