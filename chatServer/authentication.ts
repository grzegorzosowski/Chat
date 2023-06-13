import bcrypt from 'bcrypt';
import './db/mongoose';
import { UserType, UserWithId } from './db/models/User';
import { Application, Request, Response } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { findUserByEmail, updateUser } from './lib/dbRequestFunctions';
import { normalizeMail } from './controllers/userFunctions';

export type SerializedUser = {
    _id: string;
    nick: string;
    email: string;
    verified: boolean;
};

export const isSerializedUser = (obj: any): obj is SerializedUser => {
    return (
        obj != null &&
        typeof obj === 'object' &&
        obj._id != null &&
        obj.nick != null &&
        obj.email != null &&
        obj.verified != null
    );
};

export const initAuthentication = (app: Application) => {
    passport.use(new LocalStrategy(verify));

    passport.serializeUser((user, done) => {
        const theUser = user as SerializedUser;
        const serializedUser = {
            _id: theUser._id,
            nick: theUser.nick,
            email: normalizeMail(theUser.email),
            verified: theUser.verified,
        };
        process.nextTick(() => {
            return done(null, serializedUser);
        });
    });

    passport.deserializeUser(async (baseUser: UserWithId, done) => {
        try {
            const user = await findUserByEmail(baseUser.email);
            done(undefined, user);
        } catch (err) {
            done(err, undefined);
        }
    });

    app.use(passport.initialize());
    app.use(passport.session());
};

const verify = async (
    userEmail: string,
    password: string,
    cb: (err: Error | null, user?: UserType | false) => void
) => {
    try {
        const user = await findUserByEmail(userEmail);
        if (!user) {
            return cb(null, false);
        }
        if (!(await bcrypt.compare(password, user.password))) {
            return cb(null, false);
        }

        return cb(null, user);
    } catch (err) {
        return cb(err as any);
    }
};

export const sendUser = (req: Request, res: Response) => {
    const serializedUser = req.user;
    if (isSerializedUser(serializedUser)) {
        const userToSend = {
            _id: serializedUser._id,
            nick: serializedUser.nick,
            email: normalizeMail(serializedUser.email),
            verified: serializedUser.verified,
        };
        res.send(userToSend);
    } else {
        res.sendStatus(401).json({ message: 'Unauthorized' });
    }
};

export const loggedIn = (req: any, res: any, next: any) => {
    if (req.user) {
        req.session.user = req.user;
        next();
    } else {
        res.sendStatus(204);
    }
};

export const login = (req: Request, res: Response, next: any) => {
    passport.authenticate('local', async function (err: any, user: UserWithId) {
        if (err) {
            return next(err);
        }
        if (!user) {
            //If passport could not authenticate user, 'user' variable is empty
            const userFailedLoginAttempt = await findUserByEmail(req.body.username);
            if (!userFailedLoginAttempt) {
                return res.sendStatus(401);
            }
            await updateUser(userFailedLoginAttempt._id.toString(), {
                lastFailedLogin: {
                    timestamp: new Date().toISOString(),
                    ip: req.socket.remoteAddress ?? '',
                    userAgent: req.headers['user-agent'] ?? '',
                },
            });
            return res.sendStatus(401);
        }

        req.logIn(user, async function (loginErr) {
            if (loginErr) {
                return next(loginErr);
            }
            await updateUser(user._id.toString(), {
                lastLogin: {
                    timestamp: new Date().toISOString(),
                    ip: req.socket.remoteAddress ?? '',
                },
            });
            return res.status(200).json({ data: user, status: 200 });
        });
    })(req, res, next);
};

export const logout = (req: Request, res: Response, next: any) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.sendStatus(200);
    });
};
