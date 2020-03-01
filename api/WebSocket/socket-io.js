const ObjectId = require('mongodb').ObjectID;
const Hand = require('../../utils/Hand.js');
const db = require('../../data/dbconfig');

const connection = (io) => {
  io.on('connection', async (socket) => {
    console.log(`New client socket.id: ${socket.id} connected`);

    socket.on('get-lobby-info', async () => {
      const tables = await db('tables');
      io.emit('lobby-info', { tables });
    })
    

    socket.on('get-table-info', async (id) => {
      const table = await db('tables').where({ id }).first();
      
      const seated = await db('Seated Players').where({ tableId: table.id })

      io.emit('table-info', { seated });

      // withDB(async (db) => {
      //   const table = await db
      //     .collection('tables')
      //     .findOne({_id: ObjectId(id)});
      //   io.emit('table-info', {table});
      // });
    });

    // client will join a room corresponding to the table ID when they open a table
    socket.on('room', (room) => {
      socket.join(room);
      console.log(`Client ${socket.id} joined room ${room}`);
    });

    // try to begin a hand at a specific table/room
    socket.on('begin-hand', async (data) => {
      const { tableID , button } = data
      console.log(`Begin hand at table ${tableID}.  Button in seat ${button}.`);
      withDB(async (db) => {
        const table = await db
          .collection('tables')
          .findOne({_id: ObjectId(tableID)});
        
        const hand = new Hand(table.seatedPlayers.length, button);
        console.log(hand);
        // TODO:  Right now just sending the whole deck to the entire room.  Need to only send the neccessary cards to the correct seats.
        io.to(tableID).emit('deck', hand.deck);
      })
      
    });


    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};

module.exports = connection;
