const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3030 });

const Table = require('../utils/table.js');
const table = new Table()

wss.on('connection', function connection(ws) {
  // on connection, send the seatArray so players can see who is at table
  ws.send(JSON.stringify(table.seatArray));
  // on each incoming message from any client, do the following
  ws.on('message', function incoming(data) {
    const dataObj = JSON.parse(data);
    // switch statement to handle different types of messages (seat update, hand update)
    switch (dataObj.type) {
      // update the table's seat config
      case 'seat':
        const { seats } = dataObj
        console.log(seats);
        // set the seatArray on the table class
        table.setSeats(seats)
        // send the updating seat config back to all connected clients
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(table.seatArray));
          }
        })
        if (table.filledSeats > 1) {
          console.log('start the game here');
          table.dealHand();

        }
        break;
      default:
        break;
    }
  })
})

module.exports = wss;