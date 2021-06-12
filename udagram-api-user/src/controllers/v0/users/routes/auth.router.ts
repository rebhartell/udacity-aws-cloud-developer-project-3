import * as bcrypt from 'bcrypt';
import * as EmailValidator from 'email-validator';
import { NextFunction, Request, Response, Router } from 'express';
import * as jwt from 'jsonwebtoken';
import { requireAuth } from '../../requireAuth';
import { User } from '../models/User';
import { config } from './../../../../config/config';


const router: Router = Router();

async function generatePassword(plainTextPassword: string): Promise<string> {
  // Use Bcrypt to Generated Salted Hashed Passwords
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(plainTextPassword, salt);

  return hash;
}

async function comparePasswords(plainTextPassword: string, hash: string): Promise<boolean> {
  // Use Bcrypt to Compare your password to your Salted Hashed Password
  const compare = await bcrypt.compare(plainTextPassword, hash);

  return compare
}

function generateJWT(user: User): string {
  // Use jwt to create a new JWT Payload containing
  return jwt.sign(user.toJSON(), config.jwt.secret);
}


function setAuthResponse(res: Response, status: number, authenticated: boolean, response: string) {

  res.status(status).send({ auth: authenticated, message: response });

  res.statusMessage = response;
}


router.get('/verification',

  requireAuth,
  
  async (req: Request, res: Response, next: NextFunction) => {

    setAuthResponse(res, 200, true, 'Authenticated.');

    next();
  }
);


router.post('/login',
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;

    // check email is valid
    if (!email || !EmailValidator.validate(email)) {

      setAuthResponse(res, 400, false, 'Email is required or malformed');

      return next(new Error());
    }

    // check email password valid
    if (!password) {

      setAuthResponse(res, 400, false, 'Password is required');

      return next(new Error());

    }

    const user = await User.findByPk(email);

    // check that user exists
    if (!user) {

      setAuthResponse(res, 401, false, 'Unauthorized User');

      return next(new Error());

    }

    // check that the password matches
    const authValid = await comparePasswords(password, user.password_hash)

    if (!authValid) {
      
      setAuthResponse(res, 401, false, 'Invalid Password');

      return next(new Error());

    }

    // Generate JWT
    const jwt = generateJWT(user);

    res.status(200).send({ auth: true, token: jwt, user: user.short() });
    res.statusMessage = 'Authorized User';

    next();
  }
);


//register a new user /api/v0/users/auth/
router.post('/',
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const plainTextPassword = req.body.password;

    // check email is valid
    if (!email || !EmailValidator.validate(email)) {

      setAuthResponse(res, 400, false, 'Email is required or malformed');

      return next(new Error());

    }

    // check email password valid
    if (!plainTextPassword) {

      setAuthResponse(res, 400, false, 'Password is required');

      return next(new Error());

    }

    // find the user
    const user = await User.findByPk(email);

    // check that user doesnt exists
    if (user) {

      setAuthResponse(res, 422, false, 'User may already exist');

      return next(new Error());
    }

    const password_hash = await generatePassword(plainTextPassword);

    const newUser = await new User({
      email: email,
      password_hash: password_hash
    });

    let savedUser;
    try {
      savedUser = await newUser.save();
    } catch (e) {

      setAuthResponse(res, 500, false, 'Unable to register user');

      return next(new Error());
    }

    // Generate JWT
    const jwt = generateJWT(savedUser);

    res.status(201).send({ token: jwt, user: savedUser.short() });
    res.statusMessage = 'User registered';

    next();
  }
);


export const AuthRouter: Router = router;