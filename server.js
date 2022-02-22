const path = require('path')
const http = require('http');
const express = require('express');
//const socketio = require('socket.io');

const app = express();
// in the approch in the video, he tried to create a new Server 
//const server = http.createServer(app);

const server = app.listen(3000, () => console.log(`Server running on port ${PORT}`));
const io = require('socket.io')(server);

// Set static folder to access the public folder
app.use(express.static(path.join(__dirname, 'Public')))

// Run when client connects
io.on('connection', socket => {
  // Welcome current user
  socket.emit('message', 'Welcome to the Chat');

  // Brodcast when a user connects
  // emit to everybody expect the user who is connecting
  socket.broadcast.emit('message', 'A user has joined the chat');

  // Runs when client disconnects
  socket.on('disconnect', () => {
    io.emit('message', 'A user has left the chat')
  });
});
const PORT = 3000 || process.env.PORT;


//server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

