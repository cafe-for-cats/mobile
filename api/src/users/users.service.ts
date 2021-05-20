import { getByUserId, getByUsername } from '../users/users.statics';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const mySecret = process.env.SECRET_KEY as string;

export class UsersService {
  constructor() {}

  async getUserById(userId: any) {
    return await getByUserId(userId);
  }

  async authenticateUser(username: string, password: string) {
    const user = await getByUsername(username, password);

    if (!user) {
      return {
        status: false,
        message: 'User not found.',
      };
    }

    const isMatch = await bcrypt.compare(password, user.get('password'));

    if (!isMatch) {
      return {
        status: false,
        message: 'Password does not match.',
      };
    }

    const payload = {
      user: {
        id: user._id,
      },
    };
    let myToken;

    jwt.sign(
      payload,
      mySecret,
      {
        expiresIn: 3600,
      },
      (err, token) => {
        if (err) throw err;
        myToken = token;
      }
    );

    return {
      status: true,
      message: 'Successfully authenticated user and signed token.',
      payload: myToken,
    };
  }
}
