require('dotenv').config()

const server = require('./api/server');
const wss = require('./api/ws.js');

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`\n *** Running on port ${port} ** \n`);
});

