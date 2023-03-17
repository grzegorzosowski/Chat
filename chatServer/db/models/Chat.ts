import mongoose from 'mongoose';

export type ChatType = {
    chatName: string | undefined;
    members: Array<String> | undefined;
}

const ChatSchema = new mongoose.Schema<ChatType>({
    chatName: {
        type: String,
        required: false,
    },
    members: {
        type: Array<String>,
        required: true,
    },
})
const Chat = mongoose.model<ChatType>('Chat', ChatSchema);

export default Chat;