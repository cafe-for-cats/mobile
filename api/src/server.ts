import express from 'express';
import * as socketio from 'socket.io';
import * as path from 'path';
import { Socket } from 'net';
import Pin, { IPin } from './models/pinModels';
import pino from 'pino';
import connectDB from './config/database';
import cors from 'cors';

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

app.use(cors());

// Connect to MongoDB
connectDB();

app.get('/', (req: any, res: any) => {
  res.sendFile(path.resolve('./src/view/index.html'));
});

io.on('connection', (socket: Socket) => {
  console.log('a user connected');

  socket.on('getPins', async () => {
    const pins = await Pin.find({});

    socket.emit('getPins', JSON.stringify(pins, null, '\t'));
  });

  socket.on('addPin', async (input: any) => {
    const {
      label,
      userId,
      showOnMap = false,
      imageUrl = null,
      lat = 0.0,
      lng = 0.0
    } = input;

    const fields = {
      label,
      showOnMap,
      imageUrl,
      trackable: {
        createDate: new Date(),
        userId
      },
      position: {
        lat,
        lng
      }
    };
    let newItem;
    try {
      newItem = new Pin(fields);
      await newItem.save();

      const pins = await Pin.find({});
      socket.emit('getPins', JSON.stringify(pins, null, '\t'));

      socket.emit('addPin', JSON.stringify(newItem));
    } catch (e) {
      console.error(e.message);

      socket.emit('addPin', 'failed');
    }
  });

  socket.on('updatePin', (input: any) => {
    socket.emit('updatePin', 'success');
  });
});

const server = http.listen(3000, function() {
  console.log('listening on *:3000');
});
