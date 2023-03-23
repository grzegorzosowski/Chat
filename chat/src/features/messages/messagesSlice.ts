import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
    messageID: number;
    senderID: object;
    chatID: string;
    message: string;
    timestamp: Date;
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
            timestamp: new Date(),
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
    },
});

export const { addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
