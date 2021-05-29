import { CommonRoutesConfig } from '../common/common.routes.config';
import express from 'express';
import { UsersService } from '../users/users.service';
import { resolveSoa } from 'dns';

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application, private usersService: UsersService) {
    super(app, 'UsersRoutes');
  }

  configureRoutes() {
    this.app
      .route('/users/login')
      .post(async (req: express.Request, res: express.Response) => {
        try {
          const { username, password } = req.body;

          const result = await this.usersService.authenticateUser(
            username,
            password
          );

          res.status(200).send(result);
        } catch (e) {
          console.log(e);

          res.status(500).send({ status: false, message: 'Server error.' });
        }
      });

    this.app
      .route('/users/register')
      .post(async (req: express.Request, res: express.Response) => {
        try {
          const { username, password } = req.body;

          const result = await this.usersService.registerUser(
            username,
            password
          );

          res.status(200).send(result);
        } catch (e) {
          console.log(e);

          res.status(500).send({ status: false, message: 'Server error.' });
        }
      });

    return this.app;
  }
}

// Define what our MVP should be for october
