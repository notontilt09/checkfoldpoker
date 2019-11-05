require('dotenv').config();
const socketIO = require('socket.io');
const http = require('http');
const app = require('./api/server');
const server = http.createServer(app);
const io = socketIO(server);
const connection = require('./api/WebSocket/socket-io.js')(io);

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`\n *** Listening on port ${port} *** \n`);
});
