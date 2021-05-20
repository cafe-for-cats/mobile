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
      .route('/login')
      .post(async (req: express.Request, res: express.Response) => {
        const { username, password } = req.body;

        const token = await this.usersService.authenticateUser(
          username,
          password
        );

        res.status(200).send(token);
      });

    // this.app
    //   .route(`/users/:userId`)
    //   .all(
    //     (
    //       req: express.Request,
    //       res: express.Response,
    //       next: express.NextFunction
    //     ) => {
    //       // This middleware function runs before any request to /users/:userId
    //       // It doesn't accomplish anything just yet---it simply passes control to the next applicable function below using next()
    //       next();
    //     }
    //   )
    //   .get((req: express.Request, res: express.Response) => {
    //     res.status(200).send(`GET requested for id ${req.params.userId}`);
    //   })
    //   .put((req: express.Request, res: express.Response) => {
    //     res.status(200).send(`Put requested for id ${req.params.userId}`);
    //   })
    //   .patch((req: express.Request, res: express.Response) => {
    //     res.status(200).send(`Patch requested for id ${req.params.userId}`);
    //   })
    //   .delete((req: express.Request, res: express.Response) => {
    //     res.status(200).send(`Delete requested for id ${req.params.userId}`);
    //   });

    return this.app;
  }
}
