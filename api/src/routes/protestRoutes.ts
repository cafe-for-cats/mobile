import { Router, Response, Request } from 'express';
import { ObjectId } from 'mongodb';
import { body, validationResult } from 'express-validator';
import Protest from '../models/Protest';
import User from '../models/User';
import HttpStatusCodes from 'http-status-codes';

const cors = require('cors'); // TODO: Fix type

const allowedOrigins = [
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:8080',
  'http://localhost:8100',
  'http://localhost:8101',
  'http://localhost:4200',
  'http://192.168.1.7:8100',
];

const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS'));
    }
  },
};

const router: Router = Router();

router.post(
  '/create',
  body('title').exists().withMessage('Must provide a valid title.'),
  body('userId').exists().withMessage('Must provide a valid user id.'),
  body('description').exists().withMessage('Must provide a valid description.'),
  body('startDate')
    .exists()
    .withMessage('Must provide a valid date.')
    .isISO8601()
    .withMessage('Date must be formatted correctly.'),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json({
        errors: errors.array(),
      });
    }

    const { title, userId, description, startDate } = req.body;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.send({
          message: 'No user was found associated to the given id.',
          status: 'Failure.',
        });
      }

      const userObjectId = user?.get('_id');

      const newProtestResult = await Protest.findOneAndUpdate(
        { _id: new ObjectId() },
        {
          title,
          startDate,
          description,
          associatedUserIds: [userObjectId],
        },
        { upsert: true, new: true }
      );

      const protestId = newProtestResult?.get('_id');

      if (protestId) {
        await User.findOneAndUpdate(
          { _id: userObjectId },
          {
            $push: {
              associatedProtests: {
                protestId,
                accessLevel: 'Leader', // Creators of a protest automatically get 'Leader' status.
                isCreator: true,
              },
            },
          },
          { new: true }
        );
      }

      res.json({
        message: 'Success',
        newItem: newProtestResult,
      });
    } catch (e) {
      console.error(e);

      res.status(500).json({
        message: 'Server Error',
      });
    }
  }
);

type AccessLevels = 'Organizer' | 'Leader' | 'Attendee';

export default router;
