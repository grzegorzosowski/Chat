import { Types } from 'mongoose';
import User, { UserType, UserWithId } from '../db/models/User';
import Chat from '../db/models/Chat';
import Messages from '../db/models/Messages';
import { normalizeMail } from '../controllers/userFunctions';

export function findUserByEmail(email: string) {
    const normalizedEmail = normalizeMail(email);
    return User.findOne<UserWithId>({ email: normalizedEmail });
}

export function findUserById(id: string) {
    return User.findById({ _id: id });
}

export function updateUser(id: string | Types.ObjectId, update: Partial<UserType>) {
    return User.updateOne({ _id: id }, { $set: update });
}

export function findChatById(id: string) {
    return Chat.findById({ _id: id });
}

export function findChatByName(chatName: string) {
    return Chat.find({ chatName: chatName });
}

export function findChatByMembers(members: string[]) {
    return Chat.findOne({
        members: {
            $size: 2,
            $all: members,
        },
    });
}

export function findMessagesByChatId(chatId: string) {
    return Messages.find({ chatID: chatId });
}
