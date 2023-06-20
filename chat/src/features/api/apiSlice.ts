import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type Chat = {
    id1: string | undefined;
    id2: string | undefined;
    nick1: string | undefined;
    nick2: string | undefined;
};

type GroupChatID = {
    groupChatID: string | undefined;
};

type GroupChat = {
    _id: string;
    chatName: string;
    members: string[];
    membersNick: string[];
};

type ChatID = {
    chatID: string | undefined;
};
type User = {
    _id: string | undefined;
    nick: string | undefined;
};
type UserFromUserList = {
    _id: string;
    nick: string;
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

type Result = {
    _id: string;
    members: string[];
    chatName: string;
};

type UserList = {
    users: UserFromUserList[];
    groupChats: GroupChat[];
};

type Message = {
    messageID: number;
    senderID: string;
    chatID: string;
    message: string;
    timestamp: number;
};

export type UserDto = {
    _id: string;
    nick: string;
    email: string;
    verified: boolean;
};

export const apiSlice = createApi({
    reducerPath: 'api',
    tagTypes: ['user'],
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
        sendVerifyEmailAgain: builder.mutation({
            query: () => ({
                url: 'sendVerifyEmailAgain',
                method: 'POST',
            }),
        }),
        findChat: builder.query<Result, Chat>({
            query: (chat: Chat) => {
                console.log('Find Chat working...');
                return {
                    url: `findChat`,
                    method: 'POST',
                    body: chat,
                };
            },
        }),
        findGroupChat: builder.query<GroupChat, GroupChatID>({
            query: (chat: GroupChatID) => {
                console.log('Find Group Chat working...');
                return {
                    url: `findGroupChat`,
                    method: 'POST',
                    body: chat,
                };
            },
        }),
        getMessages: builder.query<Message[], ChatID>({
            query: (chatID: ChatID) => {
                console.log('Downloading messages for chatID: ', chatID.chatID);
                return {
                    url: `getMessages`,
                    method: 'POST',
                    body: chatID,
                };
            },
        }),
        getUserNick: builder.query<string, string>({
            query: (userID) => {
                const body: UserID = {
                    userID,
                };
                return {
                    url: `getUserNick`,
                    method: 'POST',
                    body,
                };
            },
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
        getUsers: builder.query<UserList, void>({
            query: () => ({
                url: 'getUsers',
                method: 'POST',
            }),
        }),
        getUserAccountInfo: builder.query({
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
    useSendVerifyEmailAgainMutation,
    useFindChatQuery,
    useGetMessagesQuery,
    useGetUserNickQuery,
    useGetUsersQuery,
    useCreateChatMutation,
    useFindGroupChatQuery,
    useCreateAccountMutation,
    useChangeAccountNickMutation,
    useGetUserAccountInfoQuery,
    useLogoutUserMutation,
    useResetPasswordMutation,
} = apiSlice;
