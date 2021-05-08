import express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import { UserRoutes } from './models/user/user.routes';
import connectDB from './config/database';
import rateLimit from 'express-rate-limit';
import path from 'path';

class App {
  public expressApp: express.Application;

  public io: any;
  public websocketServer: any;

  private userRoutes: UserRoutes = new UserRoutes();

  constructor() {
    this.expressApp = express();

    this.config();
    connectDB();

    this.userRoutes.route(this.expressApp);
  }

  private config(): void {
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(bodyParser.urlencoded({ extended: false }));

    this.expressApp.use(
      rateLimit({
        windowMs: 10 * 60 * 1000, // 10 minutes
        max: 100, // limit each IP to 100 requests per windowMs
      })
    );

    const httpServer = require('http').Server(this.expressApp);

    this.io = require('socket.io')(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true,
      },
    });

    this.expressApp.get('/', (req: any, res: any) => {
      res.sendFile(path.resolve('./src/view/index.html'));
    });

    this.expressApp.set('port', process.env.PORT || 3000);
  }
}

export default new App().expressApp;
