import cors from 'cors';
import * as http from 'http';
import express from 'express';
import { CommonRoutesConfig } from './common/common.routes.config';
import { UsersRoutes } from './users/users.routes.config';
import connectDB from './config/database';
import { UsersService } from './users/users.service';

const port = 5000;
const routes: Array<CommonRoutesConfig> = [];

const app: express.Application = express();
const server: http.Server = http.createServer(app);

app.use(express.json());
app.use(cors());

connectDB();

routes.push(new UsersRoutes(app, new UsersService()));

const runningMessage = `⚡️ Server running at http://localhost:${port}`;

app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage);
});

server.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    console.log(`✔  Routes configured for ${route.getName()}`);
  });
  console.log(runningMessage);
});
