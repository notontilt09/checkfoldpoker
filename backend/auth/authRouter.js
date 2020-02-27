const router = require('express').Router();
const tokenService = require('./tokenService.js');
const bcrypt = require('bcryptjs');
const db = require('../data/dbconfig');

router.post('/register', async (req, res) => {
  let {username, password} = req.body;
  // validate input to contain username > 3 chars and password > 8 chars.  Front-end validation as well to make sure passwords match and are strong enough.
  if (!username || !password) {
    res.status(400).json({message: 'Username and password required.'});
  } else if (username.length < 3) {
    res.status(400).json({message: 'Username must be at least 3 characters.'});
  } else if (password.length < 8) {
    res.status(400).json({message: 'Password must be at least 8 characters.'});
  } else {
    // generate hash from users's pw
    const hash = bcrypt.hashSync(password, 8);
    // set the user's pw to the hash
    password = hash;

    const existingUser = await db('users').where({ username }).first();
    if (existingUser) {
      res.status(400).json({message: `User ${username} already exists.`});
    } else {
      const balance = 10000;
      await db('users').insert({username, password, balance});
      const user = await db('users').where({ username }).first();
      const token = tokenService.generateToken(user);
      res.status(200).json({
        message: `Successfully registered user ${user.username}`,
        token,
      });
    }
  }
});

router.post('/login', async (req, res) => {
  const {username, password} = req.body;
  const user = await db('users').where({ username }).first();

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = tokenService.generateToken(user);
    res.status(200).json({
      message: `Welcome ${user.username}!`,
      token,
    });
  } else {
    res.status(401).json({message: 'Invalid credentials!'});
  }
});

module.exports = router;
