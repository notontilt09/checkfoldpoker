const router = require('express').Router();
const ObjectId = require('mongodb').ObjectID;
const withDB = require('../db/withDB');

router.get('/', async (req, res) => {
  withDB(async (db) => {
    const tables = await db
      .collection('tables')
      .find()
      .toArray();
    res.status(200).json(tables);
  }, res);
});

router.post('/get-balance', async (req, res) => {
  const {username} = req.body;

  withDB(async (db) => {
    const user = await db.collection('users').findOne({username: username});
    res.status(200).json({balance: user.balance});
  }, res);
});

router.post('/join-table', async (req, res) => {
  const {tableID, username, amount} = req.body;

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
          {$push: {seatedPlayers: user.username}}
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
  console.log(tableID, username, amount);

  withDB(async (db) => {
    const user = await db.collection('users').findOne({username: username});
    const table = await db
      .collection('tables')
      .findOne({_id: ObjectId(tableID)});
    // if not at the table, 400 error
    if (!table.seatedPlayers.includes(user.username)) {
      res
        .status(400)
        .json({message: `${username} is not at table ${table.name}.`});
    } else {
      // remove username from the seatedPlayers field in this table's document
      await db
        .collection('tables')
        .updateOne(
          {_id: ObjectId(tableID)},
          {$pull: {seatedPlayers: user.username}}
        );
      // add amount back to player balance
      await db
        .collection('users')
        .updateOne({username: username}, {$inc: {balance: amount}});
      console.log(table);
      res.status(200).json({
        message: `${username} has left table ${table.name} with ${amount}.`,
      });
    }
  }, res);
});

module.exports = router;
