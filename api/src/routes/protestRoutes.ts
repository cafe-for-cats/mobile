import { Router, Response, Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import { check, validationResult } from 'express-validator/check';
import Protest from '../models/Protest';
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
  '/getProtestOverviewView/:id',
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const userId = new ObjectId(req.params.id);

    try {
      const createdProtests = await Protest.find({
        creatorId: { $eq: userId },
      });

      const joinedProtests = await Protest.find({
        'users.id': { $eq: userId },
      });

      res.json({
        createdProtests,
        joinedProtests,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: 'Server Error',
      });
    }
  }
);

router.post('/add', async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { title } = req.body;

  // Use `uuidv4` instead of `ObjectId` for better uniqueness.
  const leaderUrlId = uuidv4();
  const organizerUrlId = uuidv4();
  const attendeeUrlId = uuidv4();

  try {
    const newItem = new Protest({
      title,
      shareUrls: { leaderUrlId, organizerUrlId, attendeeUrlId },
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

export default router;
