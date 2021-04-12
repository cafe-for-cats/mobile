import { Router, Response, Request } from 'express';
import HttpStatusCodes from 'http-status-codes';
import Pin from '../models/Pin';
import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { check, validationResult } from 'express-validator/check';
import jwt from 'jsonwebtoken';
import User from '../models/User';
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

router.post('/add', async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { title } = req.body;

  try {
    const newItem = new Protest({ title });

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
