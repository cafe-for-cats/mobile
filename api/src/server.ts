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

const port = process.env.PORT || 5000;
const routes: Array<CommonRoutesConfig> = [];
const sockets: Array<CommonSocketsConfig> = [];

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const io: SocketIO.Server = new SocketIO.Server(server);

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(express.json());
app.use(cors());
app.use(limiter);

connectDB();

const usersService = new UsersService();
const protestsService = new ProtestsService();

sockets.push(new CoreSockets(io));
sockets.push(new ProtestSockets(io, protestsService));
routes.push(new UsersRoutes(app, usersService));

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
