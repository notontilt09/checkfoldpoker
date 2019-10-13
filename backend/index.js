require('dotenv').config()

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3030 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    console.log(data);
    wss.clients.forEach(function each(client) {
      if (client !== ws & client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  })
})

const server = require('./api/server');

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`\n *** Running on port ${port} ** \n`);
});

