import { configureStore } from "@reduxjs/toolkit";
import messagesReducer from './features/messages/messagesSlice';
import activeChatReducer from './features/chats/chatsSlice';
import { apiSlice } from './features/api/apiSlice';

export const store = configureStore({
    reducer: {
        messages: messagesReducer,
        activeChat: activeChatReducer,
        api: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => [
        ...getDefaultMiddleware(),
        apiSlice.middleware,
      ],
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch