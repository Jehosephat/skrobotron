const express = require('express');
const { v4: uuidv4 } = require('uuid');
const http = require('http');
const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static('public'));
app.use(express.json());

const sessions = {};
const timers = {};

app.post('/api/session', (req, res) => {
  const id = uuidv4();
  sessions[id] = { home: 0, away: 0, clock: 600 };
  res.json({ sessionId: id });
});

io.on('connection', (socket) => {
  const sessionId = socket.handshake.query.sessionId;
  if (!sessionId || !sessions[sessionId]) {
    socket.disconnect(true);
    return;
  }
  socket.join(sessionId);
  socket.emit('state', sessions[sessionId]);

  socket.on('update', ({ team, delta }) => {
    const session = sessions[sessionId];
    if (!session || session[team] === undefined) return;
    session[team] = Math.max(0, session[team] + delta);
    io.to(sessionId).emit('state', session);
  });

  socket.on('startClock', () => {
    if (timers[sessionId]) return;
    timers[sessionId] = setInterval(() => {
      const session = sessions[sessionId];
      if (!session) return;
      if (session.clock > 0) {
        session.clock -= 1;
        io.to(sessionId).emit('state', session);
      } else {
        clearInterval(timers[sessionId]);
        delete timers[sessionId];
      }
    }, 1000);
  });

  socket.on('stopClock', () => {
    clearInterval(timers[sessionId]);
    delete timers[sessionId];
  });

  socket.on('resetClock', () => {
    const session = sessions[sessionId];
    if (!session) return;
    session.clock = 600;
    io.to(sessionId).emit('state', session);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
