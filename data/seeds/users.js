
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { id: 1, username: 'dan', password: 'testtest', balance: 10000 },       
        { id: 2, username: 'matt', password: 'testtest', balance: 10000 },       
      ]);
    });
};
