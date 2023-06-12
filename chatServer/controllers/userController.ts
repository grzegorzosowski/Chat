import User, { UserType, UserWithId } from '../db/models/User';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import Chat from '../db/models/Chat';
import passwordValidation from '../../chat/src/features/validations/passwordValidation';
import { nickValidation } from '../../chat/src/features/validations/nickValidation';
import { emailVerify, verifyToken } from '../lib/emailVerify';
import { v4 as uuidv4 } from 'uuid';
import { getUserFromSession, isValidEmailAddress, normalizeMail } from './userFunctions';
import { findUserByEmail, findUserById, updateUser } from '../lib/dbRequestFunctions';

const saltRounds = 12;

class UserController {
    createUser = async (req: Request, res: Response) => {
        const userNick = req.body.userNick;
        const userEmail = req.body.userEmail;
        const userPassword = req.body.userPassword;
        const passwordValidationResult = passwordValidation(userPassword);
        const { hasLengthCorrect, hasWhiteListChars } = nickValidation(userNick);
        console.log('Creating user...');
        if (!hasLengthCorrect || !hasWhiteListChars) {
            return res.status(422).json({ message: 'Nick is not valid' });
        }
        if (passwordValidationResult.includes(false)) {
            return res.status(422).json({ message: 'Password is not valid' });
        }
        if (typeof userEmail !== 'string' || userEmail === '' || !isValidEmailAddress(userEmail)) {
            return res.status(422).json({ message: 'Email is not valid' });
        }
        try {
            const checkUserExist = await findUserByEmail(userEmail);
            console.log('Founded user: ', checkUserExist);
            if (checkUserExist) {
                return res.status(422).json({ message: 'This email already exists' });
            }
            console.log('Call insertUserToDB function ');
            const normalizedEmail = normalizeMail(userEmail);
            const createdUser = await this.insertUserToDB(userNick, userPassword, normalizedEmail);
            emailVerify(createdUser);
        } catch (err: any) {
            return res.status(422).json({ message: err.message });
        }
        return res.status(201).json('User created successfully');
    };

    resetPassword = async (req: Request, res: Response) => {
        const userFromSession = getUserFromSession(req.session);
        if (!userFromSession) {
            res.sendStatus(401);
            return;
        }
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const user = await findUserById(userFromSession._id);
        if (!user) {
            return res.status(422);
        }
        if (!(await bcrypt.compare(oldPassword, user.password))) {
            return res.status(422).json({ message: 'Old password is wrong' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
        if (await bcrypt.compare(newPassword, user.password)) {
            return res.status(422).json({ message: 'New password is the same as old password' });
        }

        await updateUser(user._id, { password: hashedNewPassword });
        return res.status(200).json({ message: 'Password updated!' });
    };

    changeUserNick = async (req: Request, res: Response) => {
        const user = getUserFromSession(req.session);
        if (!user) {
            res.sendStatus(401);
            return;
        }
        const userNewNick = req.body.userNick;
        const { hasLengthCorrect, hasWhiteListChars } = nickValidation(userNewNick);

        if (!hasLengthCorrect || !hasWhiteListChars) {
            return res.status(422).json({ message: 'Nick is not valid' });
        }

        await updateUser(user._id, { nick: userNewNick });
        res.status(200);
    };
    getUserAccountInfo = async (req: Request, res: Response) => {
        const userFromSession = getUserFromSession(req.session);
        if (!userFromSession) {
            res.sendStatus(401);
            return;
        }
        const user = await findUserById(userFromSession._id);

        const { lastFailedLogin, lastLogin } = user ?? {};
        const extractedData = {
            lastFailedLogin,
            lastLogin,
        };
        res.status(200).json(extractedData);
    };
    getUserNick = async (req: Request, res: Response) => {
        const userID = req.body.userID;
        const foundedUser = await findUserById(userID);
        res.status(200).json(foundedUser?.nick);
    };

    getUsers = async (req: Request, res: Response) => {
        const users = await User.find({ nick: { $ne: req.body.nick } }).select('_id, nick');
        const groupChats = (await Chat.find({ members: req.body._id })).filter((chat: any) => chat.members.length > 2);
        res.json({ users, groupChats });
    };

    emailToken = async (req: Request, res: Response) => {
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
            await updateUser(user._id, { verified: true });

            const redirectURL = 'http://localhost:3000/emailConfirmed';
            return res.redirect(redirectURL);
        } catch (error: any) {
            console.error(error);
            res.redirect(`/?unexpected-error`);
        }
    };

    private insertUserToDB = async (nick: string, password: string, email: string): Promise<UserWithId> => {
        console.log('Inserting user to DB...');
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User<UserType>({
            nick: nick,
            email: email,
            password: hashedPassword,
            verifyToken: uuidv4(),
            verified: false,
            registerAt: new Date().toISOString(),
        });
        await newUser.save().then(() => {});
        console.log('User has been saved');
        const createdUser = await findUserByEmail(newUser.email);
        if (!createdUser) {
            throw new Error();
        }
        return createdUser;
    };
}

export = new UserController();
