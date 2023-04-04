import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
    messageID: number;
    senderID: object;
    chatID: string;
    message: string;
    timestamp: string;
}

interface MessagesState {
    messages: Message[];
}

const initialState: MessagesState = {
    messages: [
        {
            messageID: 1,
            senderID: {},
            chatID: '1',
            message: '',
            timestamp: new Date().toISOString(),
        },
    ],
};

export const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<Message>) => {
            state.messages.push(action.payload);
        },
        putMessages: (state, action: PayloadAction<Message[]>) => {
            state.messages = action.payload;
        },
    },
});

export const { addMessage, putMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
