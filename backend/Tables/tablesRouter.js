const router = require('express').Router();
const mongo = require('../db/db.js');
const ObjectId = require('mongodb').ObjectID;

router.get('/', async (req, res) => {
  const db = mongo.getDB();
  const tables = await db.collection('tables').find().toArray();
  res.status(200).json(tables);
});

router.post('/get-balance', async (req, res) => {
  const {username} = req.body;
  
  try {
    const db = mongo.getDB();
    const user = await db.collection('users').findOne({username: username});
    res.status(200).json({balance: user.balance});
  } catch (error) {
    res.status(500).json({message: `Could not get balance for user ${username}`})
  }
})

router.post('/join-table', async (req, res) => {
  const { tableID, username, amount } = req.body;

  try {
    const db = mongo.getDB();
    const user = await db.collection('users').findOne({username: username});
    const table = await db.collection('tables').findOne({_id: ObjectId(tableID)});
    // if already at the table, 400 error
    if (table.seatedPlayers.includes(user.username)) {
      res.status(400).json({message: `${username} is already at table ${table.name}.`})
    } else if (amount > user.balance) {
      res.status(400).json({message: `Buyin amount cannot be greater than balance.`})
    } else {
      // add username to the seatedPlayers field in this table's document
      await db.collection('tables').updateOne(
        {_id: ObjectId(tableID)},
        {$push: {'seatedPlayers': user.username}}
      )
      // remove buyin amount from player balance
      await db.collection('users').updateOne(
        {username: username},
        {$inc: {balance:  -amount}}
      )
      res.status(200).json({
        username: user.username,
        balance: user.balance, 
        message: `${username} joined table ${table.name} with ${amount}.`});
    }
  } catch (error) {
    res.status(500).json({message: `Could not join table.`})
  }
})

router.post('/leave-table', async (req, res) => {
  const { tableID, username, amount } = req.body;
  console.log(tableID, username, amount);

  try {
    const db = mongo.getDB();
    const user = await db.collection('users').findOne({username: username});
    const table = await db.collection('tables').findOne({_id: ObjectId(tableID)});
    // if not at the table, 400 error
    if (!table.seatedPlayers.includes(user.username)) {
      res.status(400).json({message: `${username} is not at table ${table.name}.`})
    } else {
      // remove username from the seatedPlayers field in this table's document
      await db.collection('tables').updateOne(
        {_id: ObjectId(tableID)},
        {$pull: {'seatedPlayers': user.username}}
      )
      // add amount back to player balance
      await db.collection('users').updateOne(
        {username: username},
        {$inc: {balance: amount }}
      )
      console.log(table);
      res.status(200).json({message: `${username} has left table ${table.name} with ${amount}.`})
    }

  } catch (error) {
    res.status(500).json({message: 'Error leaving table.'})
  }
})

module.exports = router