import { CommonRoutesConfig } from '../common/common.routes.config';
import express from 'express';
import { UsersService } from '../users/users.service';
import { resolveSoa } from 'dns';
import { ProtestsService } from './protests.service';

export class ProtestsRoutes extends CommonRoutesConfig {
  constructor(
    app: express.Application,
    private protestsService: ProtestsService
  ) {
    super(app, 'UsersRoutes');
  }

  configureRoutes() {
    this.app
      .route('/protests/token')
      .get(async (req: express.Request, res: express.Response) => {
        try {
          this.protestsService.getProtestShareToken();
        } catch (e) {
          console.log(e);

          res.status(500).send({ status: false, message: 'Server error.' });
        }
      });

    return this.app;
  }
}

// Define what our MVP should be for october
