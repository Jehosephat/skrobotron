import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { randomUUID } from 'crypto';
import QRCode from 'qrcode';

const app = express();
app.use(express.json());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('joinSession', (sessionId: string) => {
    socket.join(sessionId);
  });

  socket.on('scoreUpdate', ({ sessionId, score }) => {
    io.to(sessionId).emit('scoreUpdate', score);
  });

  socket.on('timerUpdate', ({ sessionId, timer }) => {
    io.to(sessionId).emit('timerUpdate', timer);
  });

  socket.on('reset', ({ sessionId }) => {
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
  const sessionId = randomUUID();
  const protocol = req.protocol;
  const host = req.get('host');
  const controlUrl = `${protocol}://${host}/control/${sessionId}`;
  const displayUrl = `${protocol}://${host}/display/${sessionId}`;
  try {
    const qrCodeData = await QRCode.toDataURL(displayUrl);
    res.json({ sessionId, controlUrl, displayUrl, qrCodeData });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

