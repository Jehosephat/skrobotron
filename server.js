const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static('public'));

// In-memory sessions
const sessions = new Map();

// Create new session
app.post('/api/session', (req, res) => {
  const id = uuidv4();
  sessions.set(id, { home: 0, away: 0 });
  res.json({ sessionId: id });
});

io.on('connection', (socket) => {
  socket.on('join', (sessionId) => {
    if (!sessions.has(sessionId)) return;
    socket.join(sessionId);
    // send current state
    socket.emit('scoreUpdate', sessions.get(sessionId));
  });

  socket.on('score', ({ sessionId, team, delta }) => {
    const session = sessions.get(sessionId);
    if (!session) return;
    session[team] += delta;
    io.to(sessionId).emit('scoreUpdate', session);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = { app, server };
