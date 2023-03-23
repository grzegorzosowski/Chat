import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ActiveChat {
    chatID: string;
    chatName: string;
    members: Array<string>;
}

interface ChatState {
    activeChat: ActiveChat;
}

const initialState: ChatState = {
    activeChat: { 
        chatID: '1', 
        chatName: 'Chat 1', 
        members: ['1', '2'] 
    },
};

export const chatsSlice = createSlice({
    name: 'activeChat',
    initialState,
    reducers: {
        setActiveChat: (state, action: PayloadAction<ActiveChat>) => {
            state.activeChat = action.payload;
        },
    },
});

export const { setActiveChat } = chatsSlice.actions;

export default chatsSlice.reducer;
