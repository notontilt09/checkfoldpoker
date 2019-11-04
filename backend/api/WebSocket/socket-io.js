const connection = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
      console.log('user disconnected');
    })
  });
}

module.exports = connection;