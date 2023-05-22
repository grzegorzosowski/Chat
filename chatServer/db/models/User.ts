import mongoose from 'mongoose';
import { WithId } from 'mongodb';

export type UserType = {
    nick: string;
    email: string;
    password: string;
    verifyToken: string;
    verified: boolean;
};

export type UserWithId = WithId<UserType>;

const UserSchema = new mongoose.Schema<UserType>({
    nick: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    verifyToken: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        required: true,
    },
});

const User = mongoose.model<UserType>('User', UserSchema);

export default User;
