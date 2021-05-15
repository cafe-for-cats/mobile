import { WS } from 'jest-websocket-mock';

test('the server keeps track of received messages, and yields them as they come in', async () => {
  const server = new WS('ws://localhost:3000');
  const client = new WebSocket('ws://localhost:3000');

  await server.connected;
  client.send('hello');
  await expect(server).toReceiveMessage('hello');
  expect(server).toHaveReceivedMessages(['hello']);
});
