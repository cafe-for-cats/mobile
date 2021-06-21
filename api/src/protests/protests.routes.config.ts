import { CommonRoutesConfig } from '../common/common.routes.config';
import express from 'express';
import { ProtestsService } from './protests.service';
import { getProtestByShareToken } from './protests.statics';
import { validateUser } from '../middleware/authentication';

export class ProtestsRoutes extends CommonRoutesConfig {
  constructor(
    app: express.Application,
    private protestsService: ProtestsService
  ) {
    super(app, 'UsersRoutes');
  }

  configureRoutes() {
    this.app
      .route('/protests/:token')
      .all(validateUser)
      .get(async (req: express.Request, res: express.Response) => {
        try {
          const payload = await getProtestByShareToken(req.params.token);

          res.status(200).send({ status: true, message: 'Success.', payload });
        } catch (e) {
          console.log(e);

          res.status(500).send({ status: false, message: 'Server error.' });
        }
      });

    return this.app;
  }
}

// Define what our MVP should be for october
