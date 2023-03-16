import mongoose from 'mongoose';

export type MessagesType = {
    chatID: Object;
    senderID: Object;
    message: String;
    timestamp: Date;
}

const MessagesSchema = new mongoose.Schema<MessagesType>({
    chatID: {
        type: Object,
        required: true,
    },
    senderID: {
        type: Object,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
    },
})
const Messages = mongoose.model<MessagesType>('Messages', MessagesSchema);

export default Messages;