const mongo = require('../../db/db.js');
const ObjectId = require('mongodb').ObjectID;

const connection = (io) => {
  io.on('connection', async (socket) => {
    console.log('New client connected');    
    
    socket.on('get_table_id', async (data) => {
      const db = mongo.getDB();
      const table = await db.collection('tables').findOne({_id: ObjectId(data)});
      // only send table info back to the client who asked for it
      socket.emit('table info', {table})
    })
    
    socket.on('disconnect', () => {
      console.log('user disconnected');
    })
  });
}

module.exports = connection;