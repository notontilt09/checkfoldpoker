// const mongo = require('../../db/db.js');
const ObjectId = require('mongodb').ObjectID;
const withDB = require('../../db/withDB');

const connection = (io) => {
  io.on('connection', async (socket) => {
    console.log(`New client socket.id: ${socket.id} connected`);

    socket.on('get_table_info', async (id) => {
      withDB(async (db) => {
        const table = await db
          .collection('tables')
          .findOne({_id: ObjectId(id)});
        socket.emit('table-info', {table});
      });
    });

    // client will join a room corresponding to the table ID when they open a table
    socket.on('room', (room) => {
      socket.join(room);
      console.log(`Client ${socket.id} joined room ${room}`);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};

module.exports = connection;
