const router = require('express').Router();
const mongo = require('../db/db.js');
const ObjectId = require('mongodb').ObjectID;

router.get('/', async (req, res) => {
  const db = mongo.getDB();
  const tables = await db.collection('tables').find().toArray();
  res.status(200).json(tables);
});

router.post('/join-table', async (req, res) => {
  const { tableID, username } = req.body;

  try {
    const db = mongo.getDB();
    const user = await db.collection('users').findOne({username: username});
    const table = await db.collection('tables').findOne({_id: ObjectId(tableID)});
    // if already at the table, 400 error
    if (table.seatedPlayers.includes(user.username)) {
      res.status(400).json({message: `${username} is already at table ${table.name}.`})
    } else {
      // add username to the seatedPlayers field in this table's document
      await db.collection('tables').updateOne(
        {_id: ObjectId(tableID)},
        {$push: {'seatedPlayers': user.username}}
      )
      res.status(200).json({
        username: user.username,
        balance: user.balance, 
        message: `${username} joined table ${table.name}.`});
    }
  } catch (error) {
    res.status(500).json({message: `Could not join table.`})
  }
})

router.post('/leave-table', async (req, res) => {
  const { tableID, username } = req.body;

  try {
    const db = mongo.getDB();
    const user = await db.collection('users').findOne({username: username});
    const table = await db.collection('tables').findOne({_id: ObjectId(tableID)});
    // if not at the table, 400 error
    if (!table.seatedPlayers.includes(user.username)) {
      res.status(400).json({message: `${username} is not at table ${table.name}.`})
    } else {
      // remove username from the seatedPLayer field in this table's document
      await db.collection('tables').updateOne(
        {_id: ObjectId(tableID)},
        {$pull: {'seatedPlayers': user.username}}
      )
      console.log(table);
      res.status(200).json({message: `${username} has left table ${table.name}.`})
    }

  } catch (error) {
    
  }
})

module.exports = router