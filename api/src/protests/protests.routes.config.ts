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
      .route('/protests/addUser')
      .post(async (req: express.Request, res: express.Response) => {
        const { protestId, userId, accessLevel } = req.body;

        try {
          const { status, payload, message } =
            await this.protestsService.addUserToProtest({
              protestId,
              userId,
              accessLevel,
            });

          return res.status(200).send({ status, message, payload });
        } catch (error) {}
      });

    this.app
      .route('/protests/:key')
      .all(validateUser)
      .get(async (req: express.Request, res: express.Response) => {
        try {
          const { key } = req.params;

          if (!key) {
            return res
              .status(400)
              .send({ status: true, message: 'Must provide a key.' });
          }

          switch (key.length) {
            case KeyTypeLengths.Token:
              const { status, payload, message } =
                await this.protestsService.getProtestByToken(key);

              return res.status(200).send({ status, message, payload });
            case KeyTypeLengths.ObjectId:
              return res.status(200).send({
                status: false,
                message: 'GET not implemented for Protest by ObjectId.',
              });
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

enum KeyTypeLengths {
  /** The length of a share token for a protest. For example: `8c9i-9epS` */
  Token = 9,
  /** The length of an `ObjectId` for a protest. For example: `60b974f68a66171753b8bde9` */
  ObjectId = 24,
}
