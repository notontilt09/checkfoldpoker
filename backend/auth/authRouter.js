const router = require('express').Router();
const tokenService = require('./tokenService.js');
const bcrypt = require('bcryptjs');
const mongo = require('../db/db.js');

router.post('/register', async (req, res) => {
  let user = req.body;
  // validate input to contain username > 3 chars and password > 8 chars.  Front-end validation as well to make sure passwords match and are strong enough.
  if (!user.username || !user.password) {
    res.status(404).json({message: 'Username and password required.'});
  } else if (user.username.length < 3) {
    res.status(404).json({message: 'Username must be at least 3 characters.'});
  } else if (user.password.length < 8) {
    res.status(404).json({message: 'Password must be at least 8 characters.'});
  } else {
    // generate hash from users's pw
    const hash = bcrypt.hashSync(user.password, 8);
    // set the user's pw to the hash
    user.password = hash;

    // try adding a user to the database
    try {
      // grab the mongoDB and the users table
      const db = mongo.getDB();
      const users = db.collection('users');
      // check to make sure user isn't already in the db, before adding
      const existingUser = await users.findOne({username: user.username});
      // if username exists, return 400 and corresponding message
      if (existingUser) {
        res.status(400).json({error: `user ${user.username} already exists.`});
        // otherwise add the user to the db
      } else {
        await users.insertOne(user);
        res.status(201).json(user);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({message: 'Error registering user.'});
    }
  }
});

router.post('/login', async (req, res) => {
  let {username, password} = req.body;

  try {
    const db = mongo.getDB();
    const users = db.collection('users');
    const user = await users.findOne({username: username});

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = tokenService.generateToken(user);
      res.status(200).json({
        message: `Welcome ${user.username}!`,
        token,
      });
    } else {
      res.status(401).json({message: 'Invalid credentials!'});
    }
  } catch (error) {
    res.status(500).json({message: 'Erro retreiving user info.'});
  }
});

module.exports = router;
