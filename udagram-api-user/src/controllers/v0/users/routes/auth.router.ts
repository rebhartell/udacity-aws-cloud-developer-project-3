import * as bcrypt from 'bcrypt';
import * as EmailValidator from 'email-validator';
import { Request, Response, Router } from 'express';
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

router.get('/verification',
    requireAuth,
    async (req: Request, res: Response) => {
        return res.status(200).send({ auth: true, message: 'Authenticated.' });
    });

router.post('/login', async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    // check email is valid
    if (!email || !EmailValidator.validate(email)) {
        return res.status(400).send({ auth: false, message: 'Email is required or malformed' });
    }

    // check email password valid
    if (!password) {
        return res.status(400).send({ auth: false, message: 'Password is required' });
    }

    const user = await User.findByPk(email);
    // check that user exists
    if (!user) {
        return res.status(401).send({ auth: false, message: 'Unauthorized User' });
    }

    // check that the password matches
    const authValid = await comparePasswords(password, user.password_hash)

    if (!authValid) {
        return res.status(401).send({ auth: false, message: 'Invalid Password' });
    }

    // Generate JWT
    const jwt = generateJWT(user);

    res.status(200).send({ auth: true, token: jwt, user: user.short() });
});

//register a new user /api/v0/users/auth/
router.post('/', async (req: Request, res: Response) => {
    const email = req.body.email;
    const plainTextPassword = req.body.password;
    // check email is valid
    if (!email || !EmailValidator.validate(email)) {
        return res.status(400).send({ auth: false, message: 'Email is required or malformed' });
    }

    // check email password valid
    if (!plainTextPassword) {
        return res.status(400).send({ auth: false, message: 'Password is required' });
    }

    // find the user
    const user = await User.findByPk(email);
    // check that user doesnt exists
    if (user) {
        return res.status(422).send({ auth: false, message: 'User may already exist' });
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
        throw e;
    }

    // Generate JWT
    const jwt = generateJWT(savedUser);

    res.status(201).send({ token: jwt, user: savedUser.short() });
});

router.get('/', async (req: Request, res: Response) => {
    res.send('auth')
});

export const AuthRouter: Router = router;