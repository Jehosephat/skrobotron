import request from 'supertest';
import { app, httpServer } from '../server';
import { AddressInfo } from 'net';

let server: any;
let url: string;

beforeAll((done) => {
  server = httpServer.listen(0, () => {
    const { port } = server.address() as AddressInfo;
    url = `http://localhost:${port}`;
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

test('creates a new session', async () => {
  const res = await request(url).post('/session').send({});
  expect(res.status).toBe(200);
  expect(res.body.sessionId).toBeDefined();
  expect(res.body.controlUrl).toContain(res.body.sessionId);
  expect(res.body.displayUrl).toContain(res.body.sessionId);
  expect(res.body.qrCodeData).toBeDefined();
});
