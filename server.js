const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the "public" directory
app.use(express.static('public'));

// Array to store chat messages
const chatHistory = [];

// Array to store connected users
let onlineUsers = [];

// Socket.IO connection handler
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send chat history to new client
    socket.emit('chat history', chatHistory);

    // Handle new user connection
    socket.on('user connected', (userName) => {
        socket.userName = userName;
        onlineUsers.push(userName);
        io.emit('online users', onlineUsers);
    });

    // Handle incoming messages
    socket.on('chat message', (msg) => {
        console.log('Message:', msg);
        io.emit('chat message', msg);
        chatHistory.push(msg);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        // Remove user from the online users array and update the list
        onlineUsers = onlineUsers.filter((user) => user !== socket.userName);
        io.emit('online users', onlineUsers);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
