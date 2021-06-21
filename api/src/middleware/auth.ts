import { Response, NextFunction, Request } from 'express';
import HttpStatusCodes from 'http-status-codes';
import jwt from 'jsonwebtoken';

/**
 * Is not implemented anywhere right now. Needs to be revisited with a better understanding of JWT.
 */
export default function(req: Request, res: Response, next: NextFunction) {
  // Get token from header
  const token: string = req.headers['authorization'] || '';

  // Check if no token
  if (!token) {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ msg: 'No token, authorization denied' });
  }

  const split = token.split(' ')[1];
  // Verify token
  try {
    jwt.verify(
      split,
      process.env.ACCESS_TOKEN_SECRET as string,
      (err: any, user: any) => {
        if (err) return res.sendStatus(403);
      }
    );
    next();
  } catch (err) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({ msg: err.message });
  }
}
