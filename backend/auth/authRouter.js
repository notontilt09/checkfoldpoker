const router = require('express').Router();
const tokenService = require('./tokenService.js');
const bcrypt = require('bcryptjs');
const withDB = require('../db/withDB.js');

router.post('/register', async (req, res) => {
  // console.log(req.body);
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

    withDB(async (db) => {
      const users = db.collection('users');
      const existingUser = await users.findOne({username: username});
      if (existingUser) {
        res.status(400).json({error: `user ${username} already exists.`});
      } else {
        const dbres = await users.insertOne({username, password});
        const user = await users.findOne({_id: dbres.insertedId});
        const token = tokenService.generateToken(user);
        res.status(200).json({
          message: `Successfully registered user ${user.username}`,
          token,
        });
      }
    }, res);
  }
});

router.post('/login', async (req, res) => {
  const {username, password} = req.body;

  withDB(async (db) => {
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
  }, res);
});

module.exports = router;
