import mongoose from 'mongoose';

export type UserType = {
    nick: string;
    email: string;
    password: string;
};

export type UserWithId = {
    _id: mongoose.ObjectId;
} & UserType;

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
});

const User = mongoose.model<UserType>('User', UserSchema);

export default User;
