import express from 'express';
import * as socketio from 'socket.io';
import * as path from 'path';
import { Socket } from 'net';
import { IPin } from './models/pinModels';
import pino from 'pino';

const app = express();

const logger = pino({
  level: process.env.LOG_LEVEL || 'trace',
  prettyPrint: {
    levelFirst: true,
    translateTime: true,
    ignore: 'pid,hostname'
  }
});

app.set('port', process.env.PORT || 3000);
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.get('/', (req: any, res: any) => {
  res.sendFile(path.resolve('./src/view/index.html'));
});

io.on('connection', (socket: Socket) => {
  console.log('a user connected');

  socket.on('getPins', () => {
    const pins: string[] = ['one', 'two'];
    socket.emit('getPins', JSON.stringify(pins));
  });

  socket.on('updatePin', (input: any) => {
    socket.emit('updatePin', 'success');
  });
});

const server = http.listen(3000, function() {
  console.log('listening on *:3000');
});
