import mongoose, { Date } from 'mongoose';
import { WithId } from 'mongodb';

export type UserType = {
    nick: string;
    email: string;
    password: string;
    verifyToken: string;
    verified: boolean;
    registerAt: string;
    lastLogin?: {
        timestamp: string;
        ip: string;
    };
    lastFailedLogin?: {
        timestamp: string;
        ip: string;
        userAgent: string;
    };
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
    registerAt: {
        type: String,
        required: true,
    },
    lastLogin: {
        type: Object,
        required: false,
    },
    lastFailedLogin: {
        type: Object,
        required: false,
    },
});

const User = mongoose.model<UserType>('User', UserSchema);

export default User;
