const express = require('express');
const http = require('http');
const path = require('path');
const { randomUUID } = require('crypto');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// In-memory session store
const sessions = new Map();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Create a new session and return control/display URLs
app.post('/session', (req, res) => {
  const id = randomUUID();
  sessions.set(id, { home: 0, away: 0 });
  res.json({
    controlUrl: `/control/${id}`,
    displayUrl: `/display/${id}`
  });
});

// Serve control and display pages
app.get('/control/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'control.html'));
});

app.get('/display/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'display.html'));
});

io.on('connection', (socket) => {
  const { sessionId, role } = socket.handshake.query;
  if (!sessionId || !sessions.has(sessionId)) {
    socket.disconnect();
    return;
  }
  socket.join(sessionId);
  // Send current state to new connection
  socket.emit('scoreUpdate', sessions.get(sessionId));

  if (role === 'control') {
    socket.on('increment', (team) => {
      const state = sessions.get(sessionId);
      state[team] += 1;
      io.to(sessionId).emit('scoreUpdate', state);
    });
    socket.on('decrement', (team) => {
      const state = sessions.get(sessionId);
      state[team] = Math.max(0, state[team] - 1);
      io.to(sessionId).emit('scoreUpdate', state);
    });
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

