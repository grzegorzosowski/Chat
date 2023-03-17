import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
    messageID: string;
    senderID: object;
    chatID: object;
    message: string;
    timestamp: Date;
}

interface MessagesState {
    messages: Message[];
}

const initialState: MessagesState = {
    messages: [{
        messageID: '',
        senderID: {},
        chatID: {id: 0},
        message: "",
        timestamp: new Date(),
    }],
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

export const {addMessage} = messagesSlice.actions;

export default messagesSlice.reducer;
