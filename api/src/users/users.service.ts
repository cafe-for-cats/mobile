import { getByUserId, getByUsername } from '../users/users.statics';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Schema } from 'mongoose';
const mySecret = process.env.SECRET_KEY as string;

export class UsersService {
  constructor() {}

  async getUserById(userId: string) {
    const user = await getByUserId(userId);

    if (!user) {
      return {
        status: false,
        message: 'User not found.',
      };
    }

    return {
      status: true,
      message: 'User successfully found.',
      payload: { user },
    };
  }

  async getByUsername(username: string) {
    const user = await getByUsername(username);

    if (!user) {
      return {
        status: false,
        message: `Hm... I don't recognize you. Were you drunk last time, or was it me?`,
      };
    }

    return {
      status: true,
      message: 'Hey, good to see you again!.',
      payload: {
        user,
      },
    };
  }

  async authenticateUser(username: string, password: string) {
    const user = await getByUsername(username);

    if (!mySecret) {
      return {
        status: false,
        message: `Oh no, where'd your key go?`,
      };
    }

    if (!user) {
      return {
        status: false,
        message: `Hm... I don't recognize you. Were you drunk last time, or was it me?`,
      };
    }

    const isMatch = await bcrypt.compare(password, user.get('password'));

    if (!isMatch) {
      return {
        status: false,
        message: "Are you sure that's the way it's spelled?",
      };
    }

    const payload = {
      user: {
        id: user._id,
      },
    };

    const myToken = await generateJWT(payload);

    return {
      status: true,
      message: 'Successfully authenticated user and signed token.',
      payload: { token: myToken },
    };
  }

  async registerUser(username: string, password :string) {

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const result = await User.findOneAndUpdate(
      { _id: new ObjectId() },
      {
        $set: { username, password: hash },
      },
      { upsert: true, new: true }
    );

    if (!result.id) {
      return res.json({
        message: 'Failure.',
      });
    }

    const payload = {
      user: {
        id: result.id,
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
        } catch (e) {
          console.log(e);

          res.status(500).send({ status: false, message: 'Server error.' });
        }
      });

  }
}

/**
 * Signs the raw payload as a JWT.
 * @param payload The users id.
 * @returns The signed token.
 */
async function generateJWT(payload: {}) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      mySecret,
      {
        expiresIn: 3600,
      },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    );
  });
}

interface ReturnResult {
  status: boolean;
  message: string;
  payload?: {};
}
