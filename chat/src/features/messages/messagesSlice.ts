import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
    messageID: number;
    senderID: string;
    chatID: string;
    message: string;
    timestamp: number;
}

interface MessagesState {
    messages: Message[];
}

const initialState: MessagesState = {
    messages: [
        {
            messageID: 1,
            senderID: '1',
            chatID: '1',
            message: '',
            timestamp: new Date().getTime(),
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
