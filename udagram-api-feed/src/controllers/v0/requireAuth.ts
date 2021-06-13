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
  // TODO frontend has been supplying multiple bearer+token comma-separated
  // WORKAROUND take the first token
  const tokens: string[] = req.headers.authorization.split(',');
  // console.log(tokens);
  // const tokenBearer: string[] = req.headers.authorization.split(' ');
  const tokenBearer: string[] = tokens[0].split(' ');
  if (tokenBearer.length != 2) {
    res.status(401);
    return next(new Error('Malformed token'));
  }

  const token = tokenBearer[1];

  return jwt.verify(token, config.jwt.secret, (err: any, decoded: any) => {
    if (err) {
      res.status(500);
      return next(new Error('Failed to authenticate'));
    }

    return next();
  });
}
