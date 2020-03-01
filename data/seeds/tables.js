
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('tables').del()
    .then(function () {
      // Inserts seed entries
      return knex('tables').insert([
        {id: 1, name: 'Atlanta', type: 'Hi', stakes: 5, seats: 2},
        {id: 2, name: 'Boston', type: 'Hi', stakes: 10, seats: 2},
        {id: 3, name: 'Miami', type: '2-7 Low', stakes: 5, seats: 2},
        {id: 4, name: 'New York', type: '2-7 Low', stakes: 10, seats: 2},
        {id: 5, name: 'Las Vegas', type: 'Hi Escalator', stakes: 5, seats: 2},
        {id: 6, name: 'Los Angeles', type: 'Hi Escalator', stakes: 10, seats: 2},
        {id: 7, name: 'Seattle', type: '2-7 Escalator', stakes: 5, seats: 2},
        {id: 8, name: 'Houston', type: '2-7 Escalator', stakes: 10, seats: 2},
      ]);
    });
};
