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

// Socket.IO connection handler
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send chat history to new client
    socket.emit('chat history', chatHistory);

    // Handle incoming messages
    socket.on('chat message', (msg) => {
        console.log('Message:', msg);
        // Broadcast the message to all connected clients
        io.emit('chat message', msg);
        // Add message to chat history
        chatHistory.push(msg);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
