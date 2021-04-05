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

router.post('/login', async (req: any, res: any) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { username, password } = req.body;
  try {
    let user = await User.findOne({
      username,
    });
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
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      'randomString',
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
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { username, password } = req.body; // should req.body be encrypted?
  try {
    let user = await User.findOne({
      username,
    });
    if (user) {
      return res.status(400).json({
        msg: 'User Already Exists',
      });
    }

    user = new User({
      username,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    user.set('password', hash);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      'randomString',
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
