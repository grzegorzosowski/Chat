import React, { useState, useEffect } from 'react'
import styles from '../../styles/MessageBox.module.css'
import { webSocket } from '../../webSocketConfig'
import { useAppDispatch, useAppSelector } from '../../hooks';
import { addMessage } from '../../features/messages/messagesSlice';
import { useUser } from '../../UserProvider';



export default function MessageBox(): JSX.Element {
    const user = useUser();
    const [messageText, setMessageText] = useState<string>('');
    const dispatch = useAppDispatch();
    const messages = useAppSelector((state) => state.messages.messages)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    const activeChat = useAppSelector((state) => state.activeChat.activeChat)
    useEffect(() => {
        if (user) {
            const ws = webSocket;
            console.log('WebSocket: ', ws);
            if (ws) {
                console.log('Inside if of websocket in message box');
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
                console.log('Message: ', messages);
                const newMessage = {
                    messageID: (messages[messages?.length - 1]?.messageID + 1) || 1,
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    senderID: user?._id,
                    chatID: activeChat.chatID,
                    message: messageText,
                    timestamp: new Date().toISOString(),
                }
                dispatch(addMessage(newMessage))
                console.log('New Message: ', newMessage);
                sendMessage(JSON.stringify(newMessage));
                setMessageText('')
            }
        }
    }
    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => { if (activeChat.chatID !== '1') { setMessageText(event.target.value) } }
    const sendMessage = (messages: string) => {
        if (webSocket) {
            webSocket.send(messages);
        }
    };

    return (
        <textarea
            className={styles.messageInput}
            value={messageText}
            onChange={onChange}
            onKeyDown={handleKeyPress}
        ></textarea>
    )
}
