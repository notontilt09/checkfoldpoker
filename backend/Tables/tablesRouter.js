const router = require('express').Router();
const mongo = require('../db/db.js');

router.get('/', async (req, res) => {
  console.log('here');
  const db = mongo.getDB();
  const tables = await db.collection('tables').find().toArray();
  res.status(200).json(tables);
});

module.exports = router