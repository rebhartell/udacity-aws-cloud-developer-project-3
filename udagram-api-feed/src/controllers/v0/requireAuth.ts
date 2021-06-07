import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { config } from '../../config/config';


export function requireAuth(req: Request, res: Response, next: NextFunction) {

    if (!req.headers || !req.headers.authorization) {
        return res.status(401).send({ message: 'No authorization headers.' });
    }

    // Format is <BEARER><SPACE><TOKEN>
    const tokenBearer: string[] = req.headers.authorization.split(' ');
    if (tokenBearer.length != 2) {
        return res.status(401).send({ message: 'Malformed token.' });
    }

    const token = tokenBearer[1];

    return jwt.verify(token, config.jwt.secret, (err, decoded) => {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate.' });
        }
        
        return next();
    });
}
