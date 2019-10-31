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
    // set the user's pw to the hash
    user.password = hash
    
    // try adding a user to the database
    try {
      // grab the mongoDB and the users table
      const db = mongo.getDB();
      const users = db.collection('users');
      // check to make sure user isn't already in the db, before adding
      const existingUser = await users.findOne({ username: user.username });
      // if username exists, return 400 and corresponding message
      if (existingUser) {
        res.status(400).json({ error: `user ${user.username} already exists.` })
        // otherwise add the user to the db
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