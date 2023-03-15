import React, { useState, useEffect } from 'react'
import styles from '../../styles/MessageBox.module.css'

export default function MessageBox(): JSX.Element {
    const [message, setMessage] = useState<string>('');
    const [socket, setSocket] = useState<WebSocket | null>(null);
    useEffect(() => {
        const newSocket = new WebSocket('ws://localhost:3001');
        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.addEventListener('open', () => {
                console.log('Connected to server');
            });
            socket.addEventListener('message', (event: MessageEvent<string>) => {
                console.log(`Received message: ${event.data}`);
            });
            return () => {
                socket.close();
            };
        }
    }, [socket]);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if (message.length > 0) {
                sendMessage(message);
                setMessage('')
            }
        }
    }

    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(event.target.value)




    const sendMessage = (mess: string) => {
        const message = mess;
        if (socket) { socket.send(message); }
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
