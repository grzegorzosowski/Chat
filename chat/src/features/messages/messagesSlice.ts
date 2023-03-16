import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
    ID: number;
    senderID: object;
    message: string;
    timestamp: Date;
}

interface MessagesState {
    messages: Message[];
}

const initialState: MessagesState = {
    messages: [{
        ID: 0,
        senderID: {},
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
