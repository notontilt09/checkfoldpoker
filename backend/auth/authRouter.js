const router = require('express').Router();
const tokenService = require('./tokenService.js');
const bcrypt = require('bcryptjs');
const mongo = require('../db/db.js');

router.post('/register', async (req, res) => {
  let user = req.body;
  if (!user.username || !user.password) {
    res.status(404).json({ message: "Username and password required." })
  } else {
    // generate hash from users's pw
    const hash = bcrypt.hashSync(user.password, 8);
    user.password = hash
    
    // try adding a user to the database
    try {
      const db = mongo.getDB();
      const users = db.collection('users');
      // check to make sure user isn't already in the db, before adding
      const existingUser = await users.findOne({ username: user.username });

      if (existingUser) {
        res.status(400).json({ error: `user ${user.username} already exists.` })
      } else {
        await users.insertOne(user)
        res.status(201).json({ message: `${user.username} registered.`})
      }
      
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error registering user.'})
    }
  }
})

module.exports = router;