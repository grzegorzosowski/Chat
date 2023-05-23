import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PayloadAction } from '@reduxjs/toolkit';

interface ChatData {
    chatID: string;
    chatName: string;
    members: Array<string>;
}

interface FindChatResponse {
    data: ChatData;
}

interface Chat {
    id1: string;
    id2: string;
    nick1: string;
    nick2: string;
}

interface GroupChat {
    groupChatID: string;
}

interface ChatID {
    chatID: string;
}
interface User {
    _id: string;
    nick: string;
}
interface CreateChat {
    chatName: string;
    members: Array<User>;
    createdBy: string;
}

interface CreateAccount {
    userEmail: string;
    userNick: string;
    userPassword: string;
}

interface ChangeAccount {
    userNick: unknown;
}

interface UserID {
    userID: string;
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '/' }),
    endpoints: (builder) => ({
        findChat: builder.mutation({
            query: (chat: Chat) => ({
                url: `api/findChat`,
                method: 'POST',
                body: chat,
            }),
        }),
        findGroupChat: builder.mutation({
            query: (chat: GroupChat) => ({
                url: `api/findGroupChat`,
                method: 'POST',
                body: chat,
            }),
        }),
        getMessages: builder.mutation({
            query: (chatID: ChatID) => ({
                url: `api/getMessages`,
                method: 'POST',
                body: chatID,
            }),
        }),
        getUserNick: builder.mutation({
            query: (userID: UserID) => ({
                url: `api/getUserNick`,
                method: 'POST',
                body: userID,
            }),
        }),
        createChat: builder.mutation({
            query: (chatParam: CreateChat) => ({
                url: `api/createChat`,
                method: 'POST',
                body: chatParam,
            }),
        }),
        createAccount: builder.mutation({
            query: (accountParam: CreateAccount) => ({
                url: `api/createAccount`,
                method: 'POST',
                body: accountParam,
            }),
        }),
        changeAccountNick: builder.mutation({
            query: (accountParam: ChangeAccount) => ({
                url: `api/changeAccountNick`,
                method: 'POST',
                body: accountParam,
            }),
        }),
        getUserAccountInfo: builder.mutation({
            query: (userID: UserID) => ({
                url: 'api/getUserAccountInfo',
                method: 'POST',
                body: userID,
            }),
        }),
    }),
});

export const {
    useFindChatMutation,
    useGetMessagesMutation,
    useGetUserNickMutation,
    useCreateChatMutation,
    useFindGroupChatMutation,
    useCreateAccountMutation,
    useChangeAccountNickMutation,
    useGetUserAccountInfoMutation,
} = apiSlice;

type FindChatResult = ReturnType<typeof useFindChatMutation>;
type FindChatData = FindChatResult extends Promise<PayloadAction<FindChatResponse>> ? ChatData : unknown;
