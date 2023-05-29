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

type ChangePassword = {
    oldPassword: string;
    newPassword: string;
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    endpoints: (builder) => ({
        getAuthUser: builder.query({
            query: () => ({
                url: `user`,
            }),
        }),
        findChat: builder.mutation({
            query: (chat: Chat) => ({
                url: `findChat`,
                method: 'POST',
                body: chat,
            }),
        }),
        findGroupChat: builder.mutation({
            query: (chat: GroupChat) => ({
                url: `findGroupChat`,
                method: 'POST',
                body: chat,
            }),
        }),
        getMessages: builder.mutation({
            query: (chatID: ChatID) => ({
                url: `getMessages`,
                method: 'POST',
                body: chatID,
            }),
        }),
        getUserNick: builder.mutation({
            query: (userID: UserID) => ({
                url: `getUserNick`,
                method: 'POST',
                body: userID,
            }),
        }),
        createChat: builder.mutation({
            query: (chatParam: CreateChat) => ({
                url: `createChat`,
                method: 'POST',
                body: chatParam,
            }),
        }),
        createAccount: builder.mutation({
            query: (accountParam: CreateAccount) => ({
                url: `createAccount`,
                method: 'POST',
                body: accountParam,
            }),
        }),
        changeAccountNick: builder.mutation({
            query: (accountParam: ChangeAccount) => ({
                url: `changeAccountNick`,
                method: 'POST',
                body: accountParam,
            }),
        }),
        getUserAccountInfo: builder.mutation({
            query: (userID: UserID) => ({
                url: 'getUserAccountInfo',
                method: 'POST',
                body: userID,
            }),
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: 'logout',
                method: 'POST',
            }),
        }),
        resetPassword: builder.mutation({
            query: (passwords: ChangePassword) => ({
                url: 'resetPassword',
                method: 'POST',
                body: passwords,
            }),
        }),
    }),
});

export const {
    useGetAuthUserQuery,
    useFindChatMutation,
    useGetMessagesMutation,
    useGetUserNickMutation,
    useCreateChatMutation,
    useFindGroupChatMutation,
    useCreateAccountMutation,
    useChangeAccountNickMutation,
    useGetUserAccountInfoMutation,
    useLogoutUserMutation,
    useResetPasswordMutation,
} = apiSlice;

type FindChatResult = ReturnType<typeof useFindChatMutation>;
type FindChatData = FindChatResult extends Promise<PayloadAction<FindChatResponse>> ? ChatData : unknown;
