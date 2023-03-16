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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (messages.length > 1) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const lastMessage = messages[messages.length - 1];
          sendMessage(JSON.stringify(lastMessage));
        }
      }, [messages]);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if (message.length > 0) {
                dispatch(addMessage({
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                    ID: messages.length,
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    senderID: user?._id,
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
