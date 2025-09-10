const request = require('supertest');
const ioClient = require('socket.io-client');
const { app, server } = require('../server');

const URL = `http://localhost:${server.address().port}`;

describe('session API', () => {
  afterAll(() => {
    server.close();
  });

  test('create session', async () => {
    const res = await request(app).post('/api/session');
    expect(res.status).toBe(200);
    expect(res.body.sessionId).toBeDefined();
  });

  test('score updates via socket', (done) => {
    request(app).post('/api/session').then(res => {
      const sessionId = res.body.sessionId;
      const clientB = ioClient(URL);
      let clientA;
      let initial = true;
      clientB.on('connect', () => {
        clientB.emit('join', sessionId);
        clientA = ioClient(URL);
        clientA.on('connect', () => {
          clientA.emit('join', sessionId);
          clientA.emit('score', { sessionId, team: 'home', delta: 1 });
        });
      });
      clientB.on('scoreUpdate', (data) => {
        if (initial) { initial = false; return; }
        try {
          expect(data.home).toBe(1);
          clientA.close();
          clientB.close();
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });
});
