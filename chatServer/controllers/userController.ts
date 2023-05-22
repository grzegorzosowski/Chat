import User, { UserType, UserWithId } from '../db/models/User';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import Chat from '../db/models/Chat';
import passwordValidation from '../../chat/src/features/passwordValidation/passwordValidation';
import { emailVerify, generateToken, verifyToken } from '../lib/emailVerify';
import { v4 as uuidv4 } from 'uuid';

const saltRounds = 12;

declare module 'express-session' {
    interface Session {
        passport: any; // lub użyj bardziej konkretnego typu dla passport
    }
}

class UserController {
    async createUser(req: Request, res: Response) {
        const userNick = req.body.userNick;
        const userEmail = req.body.userEmail;
        const userPassword = req.body.userPassword;
        console.log('Creating user...');
        const passwordValidationResult = passwordValidation(userPassword);
        if (passwordValidationResult.includes(false)) {
            return res.status(422).json({ message: 'Password is not valid' });
        }
        if (userNick.length < 3) {
            return res.status(422).json({ message: 'Nick is too short' });
        }
        if (userEmail === '' || !userEmail.includes('@')) {
            return res.status(422).json({ message: 'Email is not valid' });
        }
        try {
            const checkUserExist = await User.findOne({ email: userEmail });
            if (checkUserExist) {
                return res.status(422).json({ message: 'This email already exists' });
            }
            console.log('User does not exist yet');
            const createdUser = await insertUserToDB(userNick, userPassword, userEmail);
            console.log('returned created User: ', createdUser);
            emailVerify(createdUser);
        } catch (err: any) {
            return res.status(422).json({ message: err.message });
        }
        return res.status(201).json('User created successfully');
    }

    async changeUserNick(req: Request, res: Response) {
        const userNewNick = req.body.userNick;
        const userID = req.session.passport.user._id;
        let changedNick = await User.findByIdAndUpdate(userID, { nick: userNewNick }, { new: true });
        console.log('changedNick: ', changedNick);
        res.status(200).json(changedNick?.nick);
    }

    async getUserNick(req: Request, res: Response) {
        const userID = req.body.userID;
        const userNick = await User.findById(userID).select('nick');
        res.status(200).json(userNick?.nick);
    }

    async getUsers(req: Request, res: Response) {
        const users = await User.find({ nick: { $ne: req.body.nick } }).select('-password');
        console.log('req.body._id: ', req.body._id);
        const groupChats = (await Chat.find({ members: req.body._id })).filter((chat: any) => chat.members.length > 2);
        console.log('groupChats: ', groupChats);

        res.json({ users, groupChats });
    }

    async emailToken(req: Request, res: Response) {
        const { token } = req.query;
        if (typeof token !== 'string') {
            res.redirect(`/?bad-request`);
            return;
        }
        try {
            const payload = await verifyToken(token as string);

            const user = await findUserById(payload.userId);
            if (user == null) {
                res.redirect(`/?bad-request`);
                return;
            }

            if (user.verifyToken !== payload.verifyToken) {
                return;
            }

            await User.updateOne(
                { _id: user._id },
                {
                    verified: true,
                }
            );
            const redirectURL = 'http://localhost:3000/emailConfirmed';
            return res.redirect(redirectURL);
        } catch (error: any) {
            console.error(error);
            res.redirect(`/?unexpected-error`);
        }
    }
}

export = new UserController();

async function insertUserToDB(nick: string, password: string, email: string): Promise<UserWithId> {
    console.log('Inserting to DB started...');
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User<UserType>({
        nick: nick,
        email: email,
        password: hashedPassword,
        verifyToken: uuidv4(),
        verified: false,
    });
    console.log('New User: ', newUser);
    await newUser.save().then(() => {
        console.log('User has been created');
    });
    const createdUser = await findUserByEmail(newUser.email);
    if (!createdUser) {
        console.log('Some errors during inserting');
        throw new Error();
    }
    return createdUser;
}

async function findUserByEmail(email: string) {
    return await User.findOne<UserWithId>({ email: email });
}

async function findUserById(id: string) {
    return User.findById({ _id: id });
}
