import User, { UserType } from '../db/models/User'
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { json } from 'body-parser';

const saltRounds = 12;

class UserController {
    async createUser (req: Request, res: Response) {
        const userName = 'zxc';
        const userEmail = 'zxc@zxc.zxc';
        const userPassword = 'zxc';
        console.log("Creating user...")

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

    async getUsers (req: Request, res: Response) {
        const users = await User.find({nick: {$ne: req.body.nick}});
        res.json(users);
    }
}

export = new UserController;