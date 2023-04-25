import User, { UserType } from '../db/models/User';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import Chat from '../db/models/Chat';
import passwordValidation from '../../chat/src/features/passwordValidation/passwordValidation';

const saltRounds = 12;

declare module 'express-session' {
    interface Session {
        passport: any; // lub użyj bardziej konkretnego typu dla passport
    }
}
class UserController {
    async createUser(req: Request, res: Response) {
        const userName = req.body.userNick;
        const userEmail = req.body.userEmail;
        const userPassword = req.body.userPassword;
        console.log('Creating user...');
        const passwordValidationResult = passwordValidation(userPassword);
        if (passwordValidationResult.includes(false)) {
            return res.status(422).json({ message: 'Password is not valid' });
        }
        try {
            const checkUserExist = await User.findOne({ email: userEmail });
            if (checkUserExist) {
                return res.status(422).json({ message: 'This email already exists inside our user database' });
            }

            const hashedPassword = await bcrypt.hash(userPassword, saltRounds);
            const newUser = new User<UserType>({
                nick: userName,
                email: userEmail,
                password: hashedPassword,
            });
            await newUser.save().then(() => {
                console.log('User has been created');
            });
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
}

export = new UserController();
