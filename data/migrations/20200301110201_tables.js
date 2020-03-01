
exports.up = function(knex) {
  return knex.schema.createTable('tables', tbl => {
    tbl.increments();
    tbl.string('name', 128).notNullable().unique();
    tbl.enu('type', ['Hi', '2-7 Low', 'Hi Escalator', '2-7 Escalator']);
    tbl.integer('stakes').unsigned().notNullable();
    tbl.integer('seats').unsigned().notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('tables');
};
