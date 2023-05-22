import bcrypt from 'bcrypt';
import './db/mongoose';
import User, { UserType } from './db/models/User';
import { Application } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { sessionMiddleware } from './sessionMiddleware';

interface SerializedUser {
    _id: string;
    nick: string;
    email: string;
    verified: boolean;
}

export function initAuthentication(app: Application) {
    passport.use(new LocalStrategy(verify));

    passport.serializeUser((user, done) => {
        const theUser = user as SerializedUser;
        const serializedUser = {
            _id: theUser._id,
            nick: theUser.nick,
            email: theUser.email,
            verified: theUser.verified,
        };
        process.nextTick(() => {
            return done(null, serializedUser);
        });
    });

    passport.deserializeUser(async (baseUser: UserType, done) => {
        try {
            const user = await User.findOne({ email: baseUser.email });
            done(undefined, user);
        } catch (err) {
            done(err, undefined);
        }
    });
    app.use(passport.initialize());
    app.use(passport.session());
}

const verify = async (
    userEmail: string,
    password: string,
    cb: (err: Error | null, user?: UserType | false) => void
) => {
    console.log('Verify is now working');
    try {
        const user = await User.findOne<UserType>({ email: userEmail });
        if (!user) {
            return cb(null, false);
        }
        if (!(await bcrypt.compare(password, user.password))) {
            console.log('Wrong password');
            return cb(null, false);
        }

        return cb(null, user);
    } catch (err) {
        return cb(err as any);
    }
};
