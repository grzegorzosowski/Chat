import React, { useState, useEffect } from 'react'
import styles from '../../styles/MessageBox.module.css'
import { webSocket } from '../../webSocketConfig'
import { useAppDispatch, useAppSelector } from '../../hooks';
import { addMessage } from '../../features/messages/messagesSlice';
import { useUser } from '../../UserProvider';

export default function MessageBox(): JSX.Element {
    const user = useUser();
    const [message, setMessage] = useState<string>('');
    const dispatch = useAppDispatch();
    const messages = useAppSelector((state) => state.messages.messages)
    useEffect(() => {
        const ws = webSocket
        if (ws) {
            const open = () => {
                console.log('WebSocket connected');
            }
            ws.addEventListener('open', open);
            return () => {
                ws.removeEventListener('open', open);
            };
        }
    }, []);
    useEffect(() => {
        if (messages.length > 1) {
          const lastMessage = messages[messages.length - 1];
          sendMessage(JSON.stringify(lastMessage));
        }
      }, [messages]);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if (message.length > 0) {
                dispatch(addMessage({
                    messageID: messages.length.toString(),
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    senderID: user?._id,
                    chatID: {id: 1},
                    message: message,
                    timestamp: new Date(),
                }))
               
                setMessage('')
            }
        }
    }

    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(event.target.value)
    const sendMessage = (messages: string) => {
        if (webSocket) {
            webSocket.send(messages);
        }
    };

    return (
        <textarea
            className={styles.messageInput}
            value={message}
            onChange={onChange}
            onKeyDown={handleKeyPress}
        ></textarea>
    )
}
