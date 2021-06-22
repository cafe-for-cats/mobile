import cors from 'cors';
import * as http from 'http';
import express from 'express';
import { CommonRoutesConfig } from './common/common.routes.config';
import { UsersRoutes } from './users/users.routes.config';
import connectDB from './middleware/database';
import { UsersService } from './users/users.service';
import path from 'path';
import { CommonSocketsConfig } from './common/common.sockets.config';
import { CoreSockets } from './common/core.sockets.config';
import { ProtestSockets } from './protests/protests.sockets.config';
import { ProtestsService } from './protests/protests.service';
import rateLimit from 'express-rate-limit';
import SocketIO from 'socket.io';
import expressMongoSanitize from 'express-mongo-sanitize';
import { ProtestsRoutes } from './protests/protests.routes.config';

const port = process.env.PORT || 5000;
const routes: Array<CommonRoutesConfig> = [];
const sockets: Array<CommonSocketsConfig> = [];
const corsOpts: cors.CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['my-custom-header'],
  credentials: true,
};

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const io: SocketIO.Server = new SocketIO.Server(server, { cors: corsOpts });

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(cors());
app.use(express.json());
app.use(limiter);

app.use(
  expressMongoSanitize({
    replaceWith: '_',
  })
);

connectDB();

const usersService = new UsersService();
const protestsService = new ProtestsService();

sockets.push(new CoreSockets(io));
sockets.push(new ProtestSockets(io, protestsService));
routes.push(new UsersRoutes(app, usersService));
routes.push(new ProtestsRoutes(app, protestsService));

app.get('/', (req: express.Request, res: express.Response) => {
  res.sendFile(path.resolve('./src/view/index.html'));
});

server.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    console.log(`✔  Routes configured for ${route.getName()}`);
  });

  sockets.forEach((socket: CommonSocketsConfig) => {
    console.log(`✔  Sockets configured for ${socket.getName()}`);
  });

  console.log(`⚡️ Server running at http://localhost:${port}`);
});
