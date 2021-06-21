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
      .route('/protests/:key')
      .all(validateUser)
      .get(async (req: express.Request, res: express.Response) => {
        try {
          const { key } = req.params;

          if (!key) {
            return res
              .status(400)
              .send({ status: true, message: 'Must provide a token id.' });
          }

          switch (key.length) {
            case KeyTypes.Token:
              const payload = await getProtestByShareToken(key);

              return res
                .status(200)
                .send({ status: true, message: 'Success.', payload });
            case KeyTypes.ObjectId:
              return res
                .status(200)
                .send({ status: false, message: 'Not implemented.' });
          }
        } catch (e) {
          console.log(e);

          return res
            .status(500)
            .send({ status: false, message: 'Server error.' });
        }
      });

    return this.app;
  }
}

// Define what our MVP should be for october

enum KeyTypes {
  Token = 9,
  ObjectId = 24,
}
