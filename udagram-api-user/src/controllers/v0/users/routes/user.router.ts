import { NextFunction, Request, Response, Router } from 'express';
import { User } from '../models/User';
import { AuthRouter } from './auth.router';

const router: Router = Router();

router.use('/auth', AuthRouter);

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  // id is an email
  let { id } = req.params;

  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const match = id.match(emailRegex);

  if ((match === null) || (match[0] !== id)) {
    res.status(400);
    return next(new Error('Bad request'));
  }

  const item = await User.findByPk(id);

  if (!item) {
    res.status(404);
    return next(new Error('Not found'));
  }

  res.status(200).send(item);
  res.statusMessage = 'User found';

  next();
});

export const UserRouter: Router = router;
