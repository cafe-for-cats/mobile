import { Response, NextFunction, Request } from 'express';
import HttpStatusCodes from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { findUserById } from '../users/users.statics';

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

  if (!process.env.ACCESS_TOKEN_SECRET) {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ msg: 'No secret set, authorization denied' });
  }

  const payload = token.split(' ')[1];

  try {
    jwt.verify(
      payload,
      process.env.ACCESS_TOKEN_SECRET as string,
      (err: any, user: any) => {
        if (err) {
          return res
            .status(HttpStatusCodes.FORBIDDEN)
            .json({ msg: 'Token expired.' });
        }
      }
    );
  } catch (err) {
    return res.status(HttpStatusCodes.UNAUTHORIZED).json({ msg: err.message });
  }

  // TODO: if the token is expired, there will be an error about headers being set after request sent.
  // TODO: no `as DecodedToken`
  const decoded: DecodedToken = jwt.decode(payload) as DecodedToken;

  const user = await findUserById(decoded.user.id);

  if (!user) {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ msg: 'User does not exist.' });
  }

  next();
};

interface DecodedToken {
  [key: string]: any;
}
