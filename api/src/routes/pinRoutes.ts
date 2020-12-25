import { Router, Response, Request } from 'express';
import HttpStatusCodes from 'http-status-codes';
import auth from '../middleware/auth';
import Pin, { IPin } from '../models/pinModels';
import { Schema, Types } from 'mongoose';

const router: Router = Router();

/**
 * @route   GET pins/
 * @desc    Gets all pins
 */
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

/**
 * @route   GET pins/:id
 * @desc    Get a pin by its id
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = Types.ObjectId(req.params.id);

    const profile: IPin | null = await Pin.findById(id);

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

/**
 * @route POST pins/
 * @desc Create `n` number of new pins
 */
router.post('/', async (req: Request, res: Response) => {
  const now = new Date();

  const fields: any[] = req.body.input.map((x: any) => {
    return {
      label: x.label,
      userId: x.userId,
      createDate: now,
      showOnMap: true
    };
  });

  try {
    let savedItems: any[] = [];

    const promises = fields.map(async x => {
      let newItem = new Pin(x);
      await newItem.save();

      savedItems.push(newItem);
    });

    await Promise.all(promises);

    res.json(savedItems);
  } catch (e) {
    console.error(e.message);

    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
});

export default router;
