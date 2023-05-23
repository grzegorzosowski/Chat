import User, { UserWithId } from '../db/models/User';

export async function findUserByEmail(email: string) {
    return await User.findOne<UserWithId>({ email: email });
}

export async function findUserById(id: string) {
    return User.findById({ _id: id });
}
