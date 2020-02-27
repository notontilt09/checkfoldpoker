const express = require('express');
const configureMiddleware = require('./middleware.js.js');
const authRouter = require('../auth/authRouter.js.js');
const tablesRouter = require('../Tables/tablesRouter.js.js');

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
