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
import expressMongoSanitize from 'express-mongo-sanitize';
import User from './models/User';

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

app.use(
  expressMongoSanitize({
    replaceWith: '_',
  })
);

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

  socket.on('protests:addProtest', async (input) => {
    const { title, description, startDate, creatorId } = input;

    try {
      const user = await User.findById(creatorId);

      if (!user) {
        socket.emit('protests:addProtest', 'Failure. User not found.');

        return;
      }

      const userObjectId = user?.get('_id');

      const obj = new ObjectId(userObjectId);

      const newProtestResult = await Protest.findOneAndUpdate(
        { _id: new ObjectId() },
        {
          $set: {
            title,
            startDate,
            description,
            associatedUserIds: [obj],
          },
        },
        { upsert: true, new: true }
      );

      const protestId = newProtestResult?.get('_id');

      if (protestId) {
        await User.findOneAndUpdate(
          { _id: userObjectId },
          {
            $push: {
              associatedProtests: {
                protestId,
                accessLevel: 'Leader', // Creators of a protest automatically get 'Leader' status.
                isCreator: true,
              },
            },
          },
          { new: true }
        );
      }

      socket.emit('protests:addProtest', 'Success');
    } catch (e) {
      console.error(e);

      socket.emit('protests:addProtest', 'Failure');
    }

    return;
  });

  socket.on('protests:getProtestsForUser', async (input) => {
    if (!input) {
      socket.emit('protests:getProtestsForUser', {
        status: false,
        message: `'input' is required.`,
      });
    }

    const { creatorId } = input;

    const userId = new ObjectId(creatorId);

    const aggregate = await Protest.aggregate([
      {
        $match: {
          $expr: { $in: [userId, '$associatedUserIds'] },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'associatedUserIds',
          foreignField: '_id',
          as: 'user_info',
        },
      },
      {
        $group: {
          _id: new ObjectId(),
          protests: {
            $push: {
              _id: '$_id',
              title: '$title',
              description: '$description',
              startDate: '$startDate',
              usersAssociatedProtests: '$user_info.associatedProtests',
            },
          },
        },
      },
      {
        $project: {
          protests: '$protests',
        },
      },
    ]);

    const mapped = aggregate[0].protests.map((protest: any) => {
      const { _id: protestId, title, description, startDate } = protest;

      const filtered = protest.usersAssociatedProtests[0].filter(
        (userProtest: any) => userProtest.protestId.equals(protestId)
      );

      return {
        title,
        description,
        startDate,
        usersAssociatedProtests: filtered,
      };
    });

    socket.emit('protests:getProtestsForUser', JSON.stringify(mapped, null, 2));
  });

  socket.on('getProtestOverviewView', async (input) => {
    const _id = new ObjectId(input);
    const protest = await Protest.findOne({ _id: { $eq: _id } }, { title: 1 });

    console.log('hello');

    socket.emit('getProtestOverviewView', JSON.stringify(protest));
  });
});

const port = app.get('port');

const server = httpServer.listen(port, function () {
  console.log('listening on *:3000');
});

export default server;
