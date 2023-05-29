import session from 'express-session';
require('dotenv').config();
import { secret, cookieMaxAge } from './config';

export const sessionMiddleware = session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: cookieMaxAge, secure: false },
});
