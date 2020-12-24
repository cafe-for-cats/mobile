import { Router, Response, Request } from 'express';
import { check, validationResult } from 'express-validator/check';
import HttpStatusCodes from 'http-status-codes';

import auth from '../middleware/auth';
import Pin, { IPin } from '../models/pinModels';

const router: Router = Router();

// @route   GET api/profile/user/:userId
// @desc    Get profile by userId
// @access  Public
router.get('/', async (req: Request, res: Response) => {
  try {
    const profile: IPin[] | null = await Pin.find({});

    if (!profile)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ msg: 'Profile not found' });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ msg: 'Profile not found' });
    }
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
});

export default router;
