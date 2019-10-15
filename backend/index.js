require('dotenv').config()

const server = require('./api/server');
const wss = require('./api/ws.js');

const port = process.env.PORT || 5000;
const wsPort = process.env.wsPort || 3030
server.listen(port, () => {
  console.log(`\n *** REST on port ${port}, WSS on port ${wsPort} ** \n`);
});

