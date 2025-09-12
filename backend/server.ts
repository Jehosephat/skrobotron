import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { randomUUID, createHash } from 'crypto';
import QRCode from 'qrcode';

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

interface LogEvent {
  timestamp: number;
  type: string;
  value: any;
}

const sessionLogs: Record<string, LogEvent[]> = {};
const sessionPins: Record<string, string | undefined> = {};
const sessionAdmins: Record<string, Set<string>> = {};

const MAX_UPDATES_PER_MINUTE = 60;
const sessionUpdateCounts: Record<string, { count: number; start: number }> = {};

function isAuthorized(sessionId: string, socketId: string): boolean {
  return sessionPins[sessionId]
    ? sessionAdmins[sessionId]?.has(socketId) ?? false
    : true;
}

function recordUpdate(sessionId: string): boolean {
  const now = Date.now();
  const info = sessionUpdateCounts[sessionId];
  if (!info || now - info.start > 60_000) {
    sessionUpdateCounts[sessionId] = { count: 1, start: now };
    return false;
  }
  info.count += 1;
  return info.count > MAX_UPDATES_PER_MINUTE;
}

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on(
    'joinSession',
    (data: string | { sessionId: string; pin?: string }) => {
      const { sessionId, pin } =
        typeof data === 'string' ? { sessionId: data, pin: undefined } : data;
      socket.join(sessionId);
      if (sessionPins[sessionId]) {
        if (
          pin &&
          createHash('sha256').update(pin).digest('hex') === sessionPins[sessionId]
        ) {
          (sessionAdmins[sessionId] ||= new Set()).add(socket.id);
        }
      } else {
        (sessionAdmins[sessionId] ||= new Set()).add(socket.id);
      }
    }
  );

  socket.on('scoreUpdate', ({ sessionId, score }) => {
    if (!isAuthorized(sessionId, socket.id) || recordUpdate(sessionId)) return;
    (sessionLogs[sessionId] ||= []).push({
      timestamp: Date.now(),
      type: 'score',
      value: score,
    });
    io.to(sessionId).emit('scoreUpdate', score);
  });

  socket.on('timerUpdate', ({ sessionId, timer }) => {
    if (!isAuthorized(sessionId, socket.id) || recordUpdate(sessionId)) return;
    (sessionLogs[sessionId] ||= []).push({
      timestamp: Date.now(),
      type: 'clock',
      value: timer,
    });
    io.to(sessionId).emit('timerUpdate', timer);
  });

  socket.on('foul', ({ sessionId, team }) => {
    if (!isAuthorized(sessionId, socket.id) || recordUpdate(sessionId)) return;
    (sessionLogs[sessionId] ||= []).push({
      timestamp: Date.now(),
      type: 'foul',
      value: team,
    });
    io.to(sessionId).emit('foul', team);
  });

  socket.on('reset', ({ sessionId }) => {
    if (!isAuthorized(sessionId, socket.id) || recordUpdate(sessionId)) return;
    (sessionLogs[sessionId] ||= []).push({
      timestamp: Date.now(),
      type: 'reset',
      value: '',
    });
    io.to(sessionId).emit('reset');
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.get('/', (_req, res) => {
  res.send('Hello from Express + Socket.io');
});

app.post('/session', async (req, res) => {
  const { pin } = req.body as { pin?: string };
  const sessionId = randomUUID();
  const protocol = req.protocol;
  const host = req.get('host');
  const controlUrl = `${protocol}://${host}/control/${sessionId}`;
  const displayUrl = `${protocol}://${host}/display/${sessionId}`;
  try {
    const qrCodeData = await QRCode.toDataURL(displayUrl);
    sessionLogs[sessionId] = [];
    if (pin) {
      sessionPins[sessionId] = createHash('sha256').update(pin).digest('hex');
    }
    res.json({ sessionId, controlUrl, displayUrl, qrCodeData });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

app.get('/session/:id/log', (req, res) => {
  const { id } = req.params;
  const log = sessionLogs[id] || [];
  const header = 'timestamp,type,value';
  const rows = log.map((e) => `${new Date(e.timestamp).toISOString()},${e.type},${e.value}`);
  const csv = [header, ...rows].join('\n');
  res.header('Content-Type', 'text/csv');
  res.send(csv);
});

const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

