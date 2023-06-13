type MessageData = {
    messageID: number;
    senderID: string;
    chatID: string;
    message: string;
    timestamp: number;
};

type ServerMessage = {
    type: string;
    content: MessageData;
};

export default function isServerMessage(obj: unknown): obj is ServerMessage {
    if (obj == null || typeof obj !== 'object') {
        return false;
    }
    const msg = obj as ServerMessage;
    return msg.content != null && typeof msg.type === 'string';
}
