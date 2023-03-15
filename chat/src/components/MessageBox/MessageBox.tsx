import React, { useState } from 'react'
import styles from '../../styles/MessageBox.module.css'
import axios from 'axios';

export default function MessageBox(): JSX.Element {
    const [message, setMessage] = useState('');
    const getData = async () => {
        try {
            const response = await axios.get('/api');
            console.log(response.data);
            setMessage('');
        } catch (error) {
            console.error(error);
        }
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            console.log('Enter has been pressed')
            void getData();
            setMessage('')
        }
    }

    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(event.target.value)

    return (
        <textarea
            className={styles.messageInput}
            value={message}
            onChange={onChange}
            onKeyDown={handleKeyPress} 
        ></textarea>
    )
}
