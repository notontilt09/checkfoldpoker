const router = require('express').Router();
const ObjectId = require('mongodb').ObjectID;
const db = require('../data/dbconfig');

router.get('/', async (req, res) => {
  const tables = await db('tables');
  res.status(200).json(tables);
});

router.post('/info', async (req, res) => {
  const { id } = req.body;
  const table = await db('tables').where({ id }).first()
  const seatedPlayers = await db('Seated Players').where({ tableId: table.id });
  res.status(200).json({ seatedPlayers })
})

router.post('/get-balance', async (req, res) => {
  const { username } = req.body;

  try {
    const user = await db('users').where({ username });
    if (user) {
      res.status(200).json({ balance: user.balance })
    } else {
      res.status(400).json({ error: `Cannot find user ${username}.` });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/join-table', async (req, res) => {
  const {tableID, seat, username, amount} = req.body;

  withDB(async (db) => {
    const user = await db.collection('users').findOne({username: username});
    const table = await db
      .collection('tables')
      .findOne({_id: ObjectId(tableID)});

    // if already at the table, 400 error
    if (table.seatedPlayers.includes(user.username)) {
      res
        .status(400)
        .json({message: `${username} is already at table ${table.name}.`});
    } else if (amount > user.balance) {
      res
        .status(400)
        .json({message: `Buyin amount cannot be greater than balance.`});
    } else {
      // add username to the seatedPlayers field in this table's document
      await db
        .collection('tables')
        .updateOne(
          {_id: ObjectId(tableID)},
          {$push: {seatedPlayers: {seat, username: user.username, bank: amount}}}
        );
      // remove buyin amount from player balance
      await db
        .collection('users')
        .updateOne({username: username}, {$inc: {balance: -amount}});
      res.status(200).json({
        username: user.username,
        balance: user.balance,
        message: `${username} joined table ${table.name} with ${amount}.`,
      });
    }
  }, res);
});

router.post('/leave-table', async (req, res) => {
  const {tableID, username, amount} = req.body;
  // console.log(tableID, username, amount);

  withDB(async (db) => {
    const user = await db.collection('users').findOne({username: username});
    const table = await db
      .collection('tables')
      .findOne({_id: ObjectId(tableID)});
    // search the seatedPlayer array to find the user to remove
    const player = table.seatedPlayers.find(player => player.username === user.username);
      // if not at the table, 400 error
    if (!player) {
      res
        .status(400)
        .json({message: `${username} is not at table ${table.name}.`});
    } else {
      // remove user from the seatedPlayers field in this table's document
      await db
        .collection('tables')
        .updateOne(
          {_id: ObjectId(tableID)},
          {$pull: {seatedPlayers: player}}
        );
      // add amount back to player balance
      await db
        .collection('users')
        .updateOne({username: username}, {$inc: {balance: amount}});
      // console.log(table);
      res.status(200).json({
        message: `${username} has left table ${table.name} with ${amount}.`,
      });
    }
  }, res);
});

module.exports = router;
