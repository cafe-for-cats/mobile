import { Response, NextFunction, Request } from 'express';
import HttpStatusCodes from 'http-status-codes';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { findUserById } from '../users/users.statics';

// TODO: this could potentially be split in to `validateToken` and `validateUser` with
// shared helper functions.
export const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.headers['authorization'] || '';

  if (!token) {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ msg: 'No token, authorization denied' });
  }

  if (!process.env.SECRET_KEY) {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ msg: 'No secret set, authorization denied' });
  }

  const payload = token.split(' ')[1];

  try {
    await verifyToken(payload);

    const decoded: DecodedToken = jwt.decode(payload) as { [key: string]: any };

    const user = await findUserById(decoded?.user?.id);

    if (!user) {
      return res
        .status(HttpStatusCodes.UNAUTHORIZED)
        .json({ msg: 'User does not exist.' });
    }
  } catch (error) {
    let msg;

    if (error instanceof TokenExpiredError) {
      msg = 'Expired token.';
    } else {
      msg = 'Invalid token.';
    }

    return res.status(HttpStatusCodes.UNAUTHORIZED).json({ msg });
  }

  next();
};

async function verifyToken(payload: string): Promise<void> {
  return new Promise((resolve, reject) => {
    jwt.verify(payload, process.env.SECRET_KEY as string, (err: any) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

interface DecodedToken {
  [key: string]: { id: string };
}
