import { Router, Response, Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import { check, validationResult } from 'express-validator/check';
import Protest from '../models/Protest';
import User from '../models/User';
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

router.get(
  '/getProtestIfShareLinkIsValid',
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const shareTypeId = req.query.shareId;
    const protestId = req.query.protestId;

    try {
      const protest = await Protest.findById(protestId);

      const urls = protest?.get('shareUrls');

      let hasMatchingId = false;

      if (urls.find((x: any) => x.id == shareTypeId)) {
        hasMatchingId = true; // is there a better way to do this other than just checking if any id matches?
      }

      if (!protest) {
        res.send({
          message: 'No protest found.',
          status: 'Failure.',
        });
      }

      if (hasMatchingId) {
        //return protest if has matching ids
      }
    } catch (error) {}
  }
);

router.post('/setProtestShareLinks/', async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const protestId = req.body.id;
  const urlType: AccessLevels = req.body.urlType as AccessLevels;

  try {
    let shareUrl;

    switch (urlType.toLowerCase()) {
      case 'organizer':
        const urlId = new ObjectId(); // TODO: this should expire in 'n' time.
        const protest = await Protest.findOneAndUpdate(
          {
            _id: { $eq: protestId },
          },
          {
            $set: { 'shareUrls.organizerUrlId': urlId },
          },
          {
            returnOriginal: false,
            projection: {
              title: 1,
              'shareUrls.organizerUrlId': 1,
            },
          }
        );

        shareUrl = protest?.get('shareUrls.organizerUrlId');
        break;

      default:
        shareUrl = 'hello';
        break;
    }
    console.log('shareurl', shareUrl);

    res.json({
      shareUrl,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Server Error',
    });
  }
});

router.get('/getProtestsView', async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const userId = new ObjectId(req.query.userId as string);

  try {
    const protestsCreated = await Protest.find(
      {
        'associatedUsers.userId': { $eq: userId },
        'associatedUsers.isCreator': { $eq: true },
      },
      {
        title: 1,
        description: 1,
      }
    );

    const protestsJoined = await Protest.find(
      {
        'associatedUsers.userId': { $eq: userId },
        'associatedUsers.isCreator': { $eq: false },
      },
      {
        title: 1,
        description: 1,
      }
    );

    res.json({
      protestsCreated,
      protestsJoined,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Server Error',
    });
  }
});

router.post('/add', async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { title, userId, description } = req.body;

  try {
    const user = await User.findById(userId);

    const _id = user?.get('_id');

    // TODO: throw error if no user found here?

    const newItem = new Protest({
      title,
      startDate: new Date(),
      description,
      associatedUsers: {
        _id,
        isCreator: true,
        accessLevel: 'leader',
      },
    });

    await newItem.save();

    res.json({
      message: 'Success',
      newItem,
    });
  } catch (e) {
    console.error(e);

    res.status(500).json({
      message: 'Server Error',
    });
  }
});

type AccessLevels = 'Organizer' | 'Leader' | 'Attendee';

export default router;
