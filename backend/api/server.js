const express = require('express');
const configureMiddleware = require('./middleware.js');
const authRouter = require('../auth/authRouter.js');
const mongo = require('../db/db.js');

mongo.connect();

const server = express();

configureMiddleware(server);
server.use('/api/auth', authRouter);

module.exports = server;
