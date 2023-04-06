import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { PayloadAction } from '@reduxjs/toolkit';

interface ChatData {
  // zdefiniuj tutaj właściwości twoich danych czatu
    chatID: string;
    chatName: string;
    members: Array<string>;
}

interface FindChatResponse {
  data: ChatData;
}


export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '/' }),
    endpoints: (builder) => ({
        findChat: builder.mutation({
            query: (chat) => ({
                url: `api/findChat`,
                method: 'POST',
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                body: chat,
            }),
        }),
        findGroupChat: builder.mutation({
            query: (chat) => ({
                url: `api/findGroupChat`,
                method: 'POST',
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                body: chat,
            }),
        }),
        getMessages: builder.mutation({
            query: (chatID) => ({
                url: `api/getMessages`,
                method: 'POST',
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                body: chatID,
            }),
        }),
        createChat: builder.mutation({
            query: (chatParam) => ({
                url: `api/createChat`,
                method: 'POST',
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                body: chatParam,
            }),
        }),
        createAccount: builder.mutation({
            query: (accountParam) => ({
                url: `api/createAccount`,
                method: 'POST',
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                body: accountParam,
            }),
        }),
        changeAccountNick: builder.mutation({
            query: (accountParam) => ({
                url: `api/changeAccountNick`,
                method: 'POST',
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                body: accountParam,
            }),
        }),
    }),
})

export const { useFindChatMutation, useGetMessagesMutation, useCreateChatMutation, useFindGroupChatMutation, useCreateAccountMutation, useChangeAccountNickMutation } = apiSlice

type FindChatResult = ReturnType<typeof useFindChatMutation>;
type FindChatData = FindChatResult extends Promise<PayloadAction<FindChatResponse>> ? ChatData : unknown;