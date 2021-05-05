import { Router, Response, Request } from 'express';
import HttpStatusCodes from 'http-status-codes';
import Pin from '../models/Pin';
import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { check, validationResult } from 'express-validator/check';
import jwt from 'jsonwebtoken';
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
const mySecret = process.env.SECRET_KEY;

router.post('/login', async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!mySecret) {
    return res.status(400).json({
      message: 'Secret key not found for signing',
    });
  }

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: { $eq: username } });

    if (!user)
      return res.status(400).json({
        message: 'User Not Exist',
      });

    const isMatch = await bcrypt.compare(password, user.get('password'));

    if (!isMatch)
      return res.status(400).json({
        message: 'Incorrect Password!',
      });

    const payload = {
      user: {
        id: user._id,
      },
    };

    jwt.sign(
      payload,
      mySecret,
      {
        expiresIn: 3600,
      },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token,
        });
      }
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: 'Server Error',
    });
  }
});

router.post('/register', async (req: any, res: any) => {
  const errors = validationResult(req);

  // Validates a secret key in the environment variables.
  if (!mySecret) {
    return res.status(400).json({
      message: 'Secret key not found for signing',
    });
  }

  // Checks validation result from input.
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { username } = req.body;

  /**
   * Checks if there is already another user with this username [1].
   * If there is not, create a new one with an encrypted password [2].
   * After saving the new user, sign the JWT token with the new user ID [3].
   */
  try {
    let user = await User.findOne({ username: { $eq: username } });

    // [1]
    if (user) {
      return res.status(400).json({
        msg: 'User Already Exists',
      });
    }

    const { password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    user = new User({
      username,
      password: hash,
    });

    // [2]
    await user.save();

    const payload = {
      user: {
        id: user._id,
      },
    };

    // [3]
    jwt.sign(
      payload,
      mySecret,
      {
        expiresIn: 10000,
      },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token,
        });
      }
    );
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Error in Saving');
  }
});

export default router;
