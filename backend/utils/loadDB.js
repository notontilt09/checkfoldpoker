/**
 * This is a helper utility to generate tables and users for the database.
 * Alter the two constants at the top of the file to change the number of
 * each created.
 */

const withDB = require('../db/withDB');
const bcrypt = require('bcryptjs');
const NUM_USERS = 10;
const NUM_TABLES = 20;

withDB(async (db) => {
  // drop existing tables
  let res = await db.dropCollection('tables');
  res
    ? console.log(`Database Table: 'tables' dropped`)
    : console.error(`Database Table Drop Failed`);
  // Generate tables
  const tables = generateTables(NUM_TABLES);
  // Insert tables
  res = await db.collection('tables').insertMany(tables);
  console.log(`Number of Tables inserted: ${res.insertedCount}`);

  res = await db.dropCollection('users');
  res
    ? console.log(`Database Table: 'users' dropped`)
    : console.error(`Database Table Drop Failed`);

  const users = generateUsers(NUM_USERS);
  res = await db.collection('users').insertMany(users);
  console.log(`Number of Users inserted: ${res.insertedCount}`);
});

function generateTables(num) {
  const gameType = ['OFC', 'Omaha', 'Holdem', 'Stud', 'Badugi'];
  const gameStakes = ['1', '5', '10', '25', '50', '100'];
  const playerNames = [
    'Isaias',
    'Ezekiel',
    'Christian',
    'Mathias',
    'Dakota',
    'Kaden',
    'James',
    'Ralph',
    'Fernando',
    'Devin',
    'William',
    'Santiago',
    'Pierre',
    'Reed',
    'Wayne',
    'Finn',
    'Gauge',
    'Kody',
    'Adrian',
    'Dayton',
    'Tyrese',
    'Vicente',
    'Ethan',
    'Marcus',
    'Branden',
    'Quinn',
    'Landin',
    'Rene',
    'Cortez',
    'Zaid',
    'Kristian',
    'Kamari',
    'Graham',
    'Hamza',
    'Lorenzo',
    'Malakai',
    'Jaxon',
    'Yurem',
    'Jaydan',
    'Shawn',
    'Ahmed',
    'Carsen',
    'Jorge',
    'Ezequiel',
    'Dawson',
    'Mike',
    'Harley',
    'Kymani',
    'Makhi',
    'Enzo',
  ];
  const tableNames = [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'Philadelphia',
    'San Antonio',
    'San Diego',
    'Dallas',
    'San Jose',
    'Austin',
    'Jacksonville',
    'Fort Worth',
    'Columbus',
    'San Francisco',
    'Charlotte',
    'Indianapolis',
    'Seattle',
    'Denver',
    'Washington',
    'Boston',
    'El Paso',
    'Detroit',
    'Nashville',
    'Portland',
    'Memphis',
    'Oklahoma City',
    'Las Vegas',
    'Louisville',
    'Baltimore',
    'Milwaukee',
    'Albuquerque',
    'Tucson',
    'Fresno',
    'Mesa',
    'Sacramento',
    'Atlanta',
    'Kansas City',
    'Colorado Springs',
    'Miami',
    'Raleigh',
    'Omaha',
    'Long Beach',
    'Virginia Beach',
    'Oakland',
    'Minneapolis',
    'Tulsa',
    'Arlington',
    'Tampa',
    'New Orleans',
  ];

  const data = [];
  for (let i = 0; i < num; i += 1) {
    const gt = gameType[getRand(0, gameType.length - 1)];
    const gs = gameStakes[getRand(0, gameStakes.length - 1)];
    const p = gameType === 'OFC' ? '3' : '6';
    const sp = [];
    const spMax = getRand(0, p);
    for (let j = 0; j < spMax; j += 1) {
      sp[j] = playerNames[getRand(0, playerNames.length - 1)];
    }
    const obj = {
      id: getRand(100, 1000),
      type: gt,
      name: tableNames[getRand(0, tableNames.length - 1)],
      seatedPlayers: sp,
      players: p,
      stakes: gs,
    };

    data.push(obj);
  }

  return data;
}

function generateUsers(num) {
  const data = [];

  for (let i = 0; i < num; i += 1) {
    const padNum = i.toString().padStart(3, '0');
    const pass = `password${padNum}`;
    const hash = bcrypt.hashSync(pass, 8);
    const obj = {
      username: `example${padNum}`,
      password: hash,
    };

    data.push(obj);
  }

  return data;
}

function getRand(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
