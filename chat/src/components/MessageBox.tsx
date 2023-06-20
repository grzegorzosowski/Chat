import React, { useState, useEffect } from 'react'
import { webSocket } from '../webSocketConfig'
import { useAppDispatch, useAppSelector } from '../hooks';
import { addMessage } from '../features/messages/messagesSlice';
import { useUser } from '../UserProvider';
import { Box } from '@mui/material';
import { useGetMessagesQuery } from '../features/api/apiSlice';



export default function MessageBox(): JSX.Element {
    const user = useUser();
    const [messageText, setMessageText] = useState<string>('');
    const dispatch = useAppDispatch();
    const messages = useAppSelector((state) => state.messages.messages)
    const activeChat = useAppSelector((state) => state.activeChat.activeChat);
    const { refetch } = useGetMessagesQuery({ chatID: activeChat.chatID })
    useEffect(() => {
        if (user) {
            const ws = webSocket;
            if (ws) {
                const open = () => {
                    console.log('WebSocket connected');
                }
                ws.addEventListener('open', open);
                return () => {
                    ws.removeEventListener('open', open);
                };
            }
        }
    }, []);


    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if (messageText.length > 0) {
                const newMessage = {
                    messageID: (messages[messages?.length - 1]?.messageID + 1) || 1,
                    senderID: user?._id as string,
                    chatID: activeChat.chatID,
                    message: messageText,
                    timestamp: new Date().getTime(),
                }
                dispatch(addMessage(newMessage))
                sendMessage(JSON.stringify(newMessage));
                setMessageText('')
                void refetch();
            }
        }
    }
    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => { if (activeChat.chatID !== '1') { setMessageText(event.target.value) } }
    const sendMessage = (messages: string) => {
        if (webSocket) {
            webSocket.send(messages);
        }
    };

    const placeholderSwitch = () => {
        if (activeChat.chatID === '1') {
            return "Select chat to send message"
        } else {
            return "Type a message and press enter to send"
        }
    }

    return (
        <Box
            component='textarea'
            value={messageText}
            onChange={onChange}
            onKeyDown={handleKeyPress}
            placeholder={placeholderSwitch()}
            sx={{
                width: '100%',
                height: '150px',
                padding: '5px',
                boxSizing: 'border-box',
                opacity: '0.9',
                resize: 'none',
            }}
        ></Box>
    )
}
