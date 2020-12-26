import { Router, Response, Request } from 'express';
import HttpStatusCodes from 'http-status-codes';
import Pin, { IPin } from '../models/pinModels';
import { Types } from 'mongoose';
import { check, validationResult } from 'express-validator/check';

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
        .status(HttpStatusCodes.NOT_FOUND)
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
        .status(HttpStatusCodes.NOT_FOUND)
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
 * @desc Create a new pin
 */
router.post(
  '/',
  [
    check('label', `'label' is a required field.`)
      .not()
      .isEmpty(),
    check('userId', `'userId' is a required field.`)
      .not()
      .isEmpty(),
    check('lat', `'lat' is a required field.`)
      .not()
      .isEmpty(),
    check('lng', `'lng' is a required field.`)
      .not()
      .isEmpty()
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.UNPROCESSABLE_ENTITY)
        .json({ errors: errors.array() });
    }

    const {
      label,
      userId,
      showOnMap = false,
      imageUrl = null,
      lat = 0.0,
      lng = 0.0
    } = req.body;

    const fields = {
      label,
      showOnMap,
      imageUrl,
      trackable: {
        createDate: new Date(),
        userId
      },
      position: {
        lat,
        lng
      }
    };

    try {
      let newItem = new Pin(fields);
      await newItem.save();

      res.json(newItem);
    } catch (e) {
      console.error(e.message);

      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
    }
  }
);

/**
 * @route UPDATE pins/
 */
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    await Pin.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          showOnMap: req.body.showOnMap,
          label: req.body.label,
          userId: req.body.userId,
          position: {
            lat: req.body.lat,
            lng: req.body.lng
          },
          trackable: {
            userId: req.body.userId,
            createDate: req.body.createDate
          }
        }
      }
    );

    res.send('Updated Successfully');
  } catch (e) {
    console.error(e.message);

    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
});
/**
 * @route DELETE pins/
 * @desc Deletes a pin by its given id
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await Pin.findOneAndRemove({ _id: req.params.id });

    res.json('Removed Pin');
  } catch (e) {
    console.error(e.message);

    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
});

export default router;
