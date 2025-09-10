const express = require('express');
const { v4: uuidv4 } = require('uuid');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const sessions = {}; // sessionId -> {sport, state}
const DEFAULT_TIMERS = { basketball: 10 * 60, soccer: 45 * 60 };

app.post('/api/session', (req, res) => {
  const { sport } = req.body;
  const sessionId = uuidv4();
  const timer = DEFAULT_TIMERS[sport] || 10 * 60;
  sessions[sessionId] = {
    sport,
    state: { home: 0, away: 0, timer, running: false }
  };
  res.json({ sessionId });
});

io.on('connection', (socket) => {
  const { sessionId } = socket.handshake.query;
  if (!sessionId || !sessions[sessionId]) {
    socket.disconnect();
    return;
  }
  socket.join(sessionId);
  socket.emit('state', sessions[sessionId].state);

  socket.on('update', (changes) => {
    const session = sessions[sessionId];
    session.state = { ...session.state, ...changes };
    io.to(sessionId).emit('state', session.state);
  });

  socket.on('tick', () => {
    const session = sessions[sessionId];
    if (session.state.running && session.state.timer > 0) {
      session.state.timer -= 1;
      io.to(sessionId).emit('state', session.state);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
