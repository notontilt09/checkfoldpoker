const express = require('express');
const configureMiddleware = require('./middleware.js');
const authRouter = require('../auth/authRouter.js');
const tablesRouter = require('../tables/tablesRouter.js');
const mongo = require('../db/db.js');

// connect server to database
mongo.connect();

const server = express();

configureMiddleware(server);

server.get('/', (req, res) => {
  console.log('welcome');
  res.send('welcome');
});

// route handlers
server.use('/api/auth', authRouter);
server.use('/api/tables', tablesRouter);

module.exports = server;
