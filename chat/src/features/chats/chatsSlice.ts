import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ActiveChat {
    chatID: string;
    chatName: string;
    members: Array<string>;
    membersNick?: Array<string>;
}

interface ChatState {
    activeChat: ActiveChat;
    gettingChat: boolean;
}

const initialState: ChatState = {
    activeChat: {
        chatID: '1',
        chatName: 'Chat 1',
        members: ['1', '2'],
        membersNick: ['Nick 1', 'Nick 2'],
    },
    gettingChat: false,
};

export const chatsSlice = createSlice({
    name: 'activeChat',
    initialState,
    reducers: {
        setActiveChat: (state, action: PayloadAction<ActiveChat>) => {
            state.activeChat = action.payload;
        },
        setGettingChat: (state, action: PayloadAction<boolean>) => {
            state.gettingChat = action.payload;
        },
    },
});

export const { setActiveChat, setGettingChat } = chatsSlice.actions;

export default chatsSlice.reducer;
