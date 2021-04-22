import express from 'express';
import * as socketio from 'socket.io';
import * as path from 'path';
import Pin from './models/Pin';
import connectDB from './config/database';
import cors from 'cors';
import { ObjectId } from 'mongodb';
import auth from './routes/authRoutes';
import protests from './routes/protestRoutes';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import Protest from './models/Protest';

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.use('/auth', auth);
app.use('/protests', protests);

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

  socket.on('getProtestOverviewView', async (input) => {
    const _id = new ObjectId(input);
    const protest = await Protest.findOne({ _id: { $eq: _id } }, { title: 1 });

    console.log('hello');

    socket.emit('getProtestOverviewView', JSON.stringify(protest));
  });

  socket.on('getPins', async () => {
    const pins = await Pin.find({});

    const result = {
      count: pins.length,
      models: pins,
    };

    // TODO: only emit pins for sessions within the same location
    sessions.forEach((session) => {
      io.emit('getPins', JSON.stringify(result, null, '\t')); // is this emitting it for all sessions every loop?
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

      socket.emit('addPin', JSON.stringify(newItem)); // TODO: does this NEED to be emited? also if so is itonly within the same zip protest?

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
