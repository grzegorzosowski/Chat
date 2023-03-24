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
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/' }),
    endpoints: (builder) => ({
        findChat: builder.mutation({
            query: (chat) => ({
                url: `api/findChat`,
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
    }),
})

export const { useFindChatMutation, useGetMessagesMutation } = apiSlice

type FindChatResult = ReturnType<typeof useFindChatMutation>;
type FindChatData = FindChatResult extends Promise<PayloadAction<FindChatResponse>> ? ChatData : unknown;