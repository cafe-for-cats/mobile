import express from 'express';
import * as socketio from 'socket.io';
import * as path from 'path';
import Pin, { IPin } from './models/pinModels';
import pino from 'pino';
import connectDB from './config/database';
import cors from 'cors';
import { ObjectId } from 'mongodb';
import auth from './routes/authRoutes';

const app = express();

app.set('port', process.env.PORT || 3000);

const httpServer = require('http').Server(app);

const io = require('socket.io')(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

app.use(cors());

// Connect to MongoDB
connectDB();

app.use('/auth', auth);

app.get('/', (req: any, res: any) => {
  res.sendFile(path.resolve('./src/view/index.html'));
});

const sessions = new Set();

io.on('connection', (socket: SocketIO.Socket) => {
  sessions.add(socket.id);
  console.log(`User connected with id ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`User disconnected with id ${socket.id}`);
  });

  socket.on('getPins', async () => {
    const pins = await Pin.find({});

    const result = {
      count: pins.length,
      models: pins,
    };

    // TODO: only emit pins for sessions within the same location
    sessions.forEach((session) => {
      io.emit('getPins', JSON.stringify(result, null, '\t'));
    });
  });

  socket.on('addPin', async (input: any) => {
    const {
      label,
      userId,
      showOnMap = false,
      imageUrl = null,
      lat = 0.0,
      lng = 0.0,
    } = input;

    const fields = {
      label,
      showOnMap,
      imageUrl,
      trackable: {
        createDate: new Date(),
        userId,
      },
      position: {
        lat,
        lng,
      },
    };

    try {
      const newItem = new Pin(fields);
      await newItem.save();
      const pins = await Pin.find({});

      socket.emit('addPin', JSON.stringify(newItem)); // does this NEED to be emited?

      socket.broadcast.emit('getPins', JSON.stringify(pins, null, '\t'));
    } catch (e) {
      console.error(e.message);

      socket.emit('addPin', `Request Failed: ${e.message}`);
    }
  });

  socket.on('updatePin', async (input: any) => {
    const {
      label,
      userId,
      showOnMap = false,
      imageUrl = null,
      lat = 0.0,
      lng = 0.0,
    } = input;

    const fields = {
      label,
      showOnMap,
      imageUrl,
      trackable: {
        createDate: new Date(),
        userId,
      },
      position: {
        lat,
        lng,
      },
    };

    const _id = new ObjectId(input.id);

    await Pin.updateOne(
      { _id },
      {
        $set: {
          fields,
        },
      }
    );

    const pin = await Pin.findById(input.id);

    console.log('item', pin);

    socket.emit('updatePin', JSON.stringify(pin));
  });
});

const port = app.get('port');

const server = httpServer.listen(port, function () {
  console.log('listening on *:3000');
});

export default server;
