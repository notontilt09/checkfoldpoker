const express = require('express');
const configureMiddleware = require('./middleware.js');
const authRouter = require('../auth/authRouter.js');
const mongo = require('../db/db.js');
const socketIO = require('socket.io');
const http = require('http');

mongo.connect();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

configureMiddleware(app);

// route handlers
app.use('/api/auth', authRouter);

module.exports = {app, io};
