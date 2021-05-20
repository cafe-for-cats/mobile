import { CommonRoutesConfig } from '../common/common.routes.config';
import express from 'express';
import { UsersService } from '../users/users.service';

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application, private usersService: UsersService) {
    super(app, 'UsersRoutes');
  }

  configureRoutes() {
    this.app
      .route(`/users/:userId`)
      .get(async (req: express.Request, res: express.Response) => {
        const users = await this.usersService.getUserById(req.params.userId);
        res.status(200).send(users);
      });

    this.app
      .route('/users/login')
      .post(async (req: express.Request, res: express.Response) => {
        const { username, password } = req.body;

        const token = await this.usersService.authenticateUser(
          username,
          password
        );

        res.status(200).send(token);
      });

    return this.app;
  }
}
