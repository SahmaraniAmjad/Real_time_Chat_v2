const path = require('path')
const express = require('express');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();

const server = app.listen(3000, () => console.log(`Server running on port ${PORT}`));
const io = require('socket.io')(server);
const PORT = 3000 || process.env.PORT;

// Set static folder to access the public folder
app.use(express.static(path.join(__dirname, 'Public')))

const botName = 'Our bot';

// Run when client connects
io.on('connection', socket => {

  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room,)

    socket.join(user.room)

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to the Chat'));

    // Brodcast when a user connects
    // emit to everybody expect the user who is connecting
    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));


    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // listen for chatMessage
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));


      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});