import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { config } from '../../config/config';


export function requireAuth(req: Request, res: Response, next: NextFunction) {

  // check for the Authorization header
  if (!req.headers || !req.headers.authorization) {
    res.status(401);
    return next(new Error('No authorization headers'));
  }

  // Format is <BEARER><SPACE><TOKEN>
  const tokenBearer: string[] = req.headers.authorization.split(' ');
  if (tokenBearer.length != 2) {
    res.status(401);
    return next(new Error('Malformed token'));
  }

  const token = tokenBearer[1];

  return jwt.verify(token, config.jwt.secret, (err) => {
    if (err) {
      res.status(500);
      return next(new Error('Failed to authenticate'));
    }

    return next();
  });
}
