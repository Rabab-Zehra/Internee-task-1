const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Store users and rooms
const usersInRoom = {};

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static(__dirname + '/public'));

// When a user connects to the server
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // When a user joins a room
  socket.on('joinRoom', ({ username, room }) => {
    socket.join(room);
    
    if (!usersInRoom[room]) {
      usersInRoom[room] = [];
    }
    
    usersInRoom[room].push({ id: socket.id, username });

    // Emit updates to the room about users joining
    io.to(room).emit('roomUsers', usersInRoom[room]);
    io.to(room).emit('message', `${username} has joined the room.`);
  });

  // When a message is sent in the chat
  socket.on('chatMessage', ({ room, message, username }) => {
    io.to(room).emit('message', `${username}: ${message}`);
  });

  // Handle private messages
  socket.on('privateMessage', ({ toUserId, message }) => {
    io.to(toUserId).emit('message', {
      message,
      from: socket.id
    });
  });

  // When a user disconnects
  socket.on('disconnect', () => {
    for (let room in usersInRoom) {
      usersInRoom[room] = usersInRoom[room].filter(user => user.id !== socket.id);
      io.to(room).emit('roomUsers', usersInRoom[room]);
      socket.to(room).emit('message', 'A user has left the room.');
    }

    console.log('A user disconnected:', socket.id);
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
