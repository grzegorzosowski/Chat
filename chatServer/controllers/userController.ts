import User, { UserType, UserWithId } from '../db/models/User';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import Chat from '../db/models/Chat';
import passwordValidation from '../../chat/src/features/validations/passwordValidation';
import { nickValidation } from '../../chat/src/features/validations/nickValidation';
import { emailVerify, verifyToken } from '../lib/emailVerify';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongoose';
import { findUserByEmail, findUserById } from './userFunctions';

const saltRounds = 12;

declare module 'express-session' {
    interface Session {
        passport: any;
    }
}

class UserController {
    async createUser(req: Request, res: Response) {
        const userNick = req.body.userNick;
        const userEmail = req.body.userEmail;
        const userPassword = req.body.userPassword;
        console.log('Creating user...');
        const passwordValidationResult = passwordValidation(userPassword);
        const { hasLengthCorrect, hasWhiteListChars } = nickValidation(userNick);
        if (!hasLengthCorrect || !hasWhiteListChars) {
            return res.status(422).json({ message: 'Nick is not valid' });
        }
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

    async resetPassword(req: Request, res: Response) {
        console.log('Body resetPassword: ', req.body);
        const userEmail = req.session.passport.user.email;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const getUser = await User.findOne({ email: userEmail });
        if (!getUser) {
            return res.status(422);
        }
        if (!(await bcrypt.compare(oldPassword, getUser.password))) {
            return res.status(422).json({ message: 'Old password is wrong' });
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
        if (await bcrypt.compare(newPassword, getUser.password)) {
            return res.status(422).json({ message: 'New password is the same as old password' });
        } else {
            await User.updateOne({ email: userEmail }, { password: hashedNewPassword });
            return res.status(200).json({ message: 'Password updated!' });
        }
    }

    async changeUserNick(req: Request, res: Response) {
        const userNewNick = req.body.userNick;
        const userID = req.session.passport.user._id;
        let changedNick = await User.findByIdAndUpdate(userID, { nick: userNewNick }, { new: true });
        res.status(200).json(changedNick?.nick);
    }
    async getUserAccountInfo(req: Request, res: Response) {
        const user = await findUserById(req.body.userID);
        const { lastFailedLogin, lastLogin } = user ?? {};
        const extractedData = {
            lastFailedLogin,
            lastLogin,
        };
        console.log('Extracted data: ', extractedData);
        res.status(200).json(extractedData);
    }
    async getUserNick(req: Request, res: Response) {
        const userID = req.body.userID;
        const userNick = await User.findById(userID).select('nick');
        res.status(200).json(userNick?.nick);
    }

    async getUsers(req: Request, res: Response) {
        const users = await User.find({ nick: { $ne: req.body.nick } }).select('-password');
        const groupChats = (await Chat.find({ members: req.body._id })).filter((chat: any) => chat.members.length > 2);
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
    async updateUser(id: string | ObjectId, update: Partial<UserType>) {
        return await User.updateOne({ _id: id }, { $set: update });
    }

    async getUserByEmail(email: string) {
        return await User.findOne({ email });
    }
}

export = new UserController();

async function insertUserToDB(nick: string, password: string, email: string): Promise<UserWithId> {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User<UserType>({
        nick: nick,
        email: email,
        password: hashedPassword,
        verifyToken: uuidv4(),
        verified: false,
        registerAt: new Date().toISOString(),
    });
    console.log('New User: ', newUser);
    await newUser.save().then(() => {});
    const createdUser = await findUserByEmail(newUser.email);
    if (!createdUser) {
        throw new Error();
    }
    return createdUser;
}
