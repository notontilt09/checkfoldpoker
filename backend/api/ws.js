const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3030 });

const Table = require('../utils/table.js');
const table = new Table()

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    const seatInfo = JSON.parse(data);
    console.log(seatInfo);
    table.setSeats(seatInfo);
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(table.seatArray));
      }
    })
  })
})

module.exports = wss;