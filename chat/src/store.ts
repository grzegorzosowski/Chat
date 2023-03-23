import { configureStore } from "@reduxjs/toolkit";
import messagesReducer from './features/messages/messagesSlice';
import activeChatReducer from './features/chats/chatsSlice';

export const store = configureStore({
    reducer: {
        messages: messagesReducer,
        activeChat: activeChatReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch