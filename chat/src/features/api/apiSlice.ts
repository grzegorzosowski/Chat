import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type Chat = {
    id1: string;
    id2: string;
    nick1: string;
    nick2: string;
};

type GroupChat = {
    groupChatID: string;
};

type ChatID = {
    chatID: string;
};
type User = {
    _id: string | undefined;
    nick: string | undefined;
};
type CreateChat = {
    chatName: string;
    members: Array<User>;
    createdBy: string;
};

type CreateAccount = {
    userEmail: string;
    userNick: string;
    userPassword: string;
};

type ChangeAccount = {
    userNick: unknown;
};

type UserID = {
    userID: string;
};

type ChangePassword = {
    oldPassword: string;
    newPassword: string;
};

type LoginCredential = {
    username: string;
    password: string;
};

export type UserDto = {
    _id: string;
    nick: string;
    email: string;
    verified: boolean;
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    endpoints: (builder) => ({
        getAuthUser: builder.query<UserDto, void>({
            query: () => ({
                url: `user`,
            }),
        }),
        loginUser: builder.mutation({
            query: (body: LoginCredential) => ({
                url: 'login/password',
                method: 'POST',
                body: body,
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
        getUsers: builder.mutation({
            query: (body: User) => ({
                url: 'getUsers',
                method: 'POST',
                body: body,
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
    useLoginUserMutation,
    useFindChatMutation,
    useGetMessagesMutation,
    useGetUserNickMutation,
    useGetUsersMutation,
    useCreateChatMutation,
    useFindGroupChatMutation,
    useCreateAccountMutation,
    useChangeAccountNickMutation,
    useGetUserAccountInfoMutation,
    useLogoutUserMutation,
    useResetPasswordMutation,
} = apiSlice;
