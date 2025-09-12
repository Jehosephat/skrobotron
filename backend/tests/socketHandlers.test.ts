import { io as Client } from 'socket.io-client';
import request from 'supertest';
import { app, httpServer, io } from '../server';
import { AddressInfo } from 'net';

let server: any;
let port: number;

beforeAll((done) => {
  server = httpServer.listen(0, () => {
    port = (server.address() as AddressInfo).port;
    done();
  });
});

afterAll((done) => {
  io.close();
  server.close(done);
});

test('broadcasts score updates to session clients', (done) => {
  request(app)
    .post('/session')
    .send({})
    .then((res) => {
      const { sessionId } = res.body;
      const url = `http://localhost:${port}`;
      const client1 = Client(url);
      const client2 = Client(url);

      const cleanup = () => {
        client1.close();
        client2.close();
      };

      client2.on('scoreUpdate', (score: number) => {
        expect(score).toBe(5);
        cleanup();
        done();
      });

      let connected = 0;
      const onConnect = () => {
        connected += 1;
        if (connected === 2) {
          client1.emit('joinSession', sessionId);
          client2.emit('joinSession', sessionId);
          // Give join events time to process
          setTimeout(() => {
            client1.emit('scoreUpdate', { sessionId, score: 5 });
          }, 50);
        }
      };

      client1.on('connect', onConnect);
      client2.on('connect', onConnect);
    });
});
