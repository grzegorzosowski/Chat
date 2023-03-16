/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Box, Tooltip } from '@mui/material';
import { useEffect } from 'react'
import { webSocket } from '../../webSocketConfig'
import { useAppSelector } from '../../hooks';
import styles from '../../styles/ChatWindow.module.css'

export default function ChatWindow(): JSX.Element {
  const message = useAppSelector((state) => state.messages.messages)
  useEffect(() => {
    console.log(message);
    const ws = webSocket;

    if (ws) {
      const open = () => {
        console.log('WebSocket connected');
      }
      ws.addEventListener('open', open);

      const onMessage = (event: MessageEvent<string>) => {
        console.log(`Received message: ${event.data}`);
      }
      ws.addEventListener('message', onMessage);
      return () => {
        ws.removeEventListener('open', open);
        ws.removeEventListener('message', onMessage)
      };
    }
  }, []);
  return (
    <Box className={styles.main}>
      {message.slice(1).map(mess => <Tooltip title={mess.timestamp.toDateString()}>
        <Box className={styles.messageBox}>{mess.message}</Box>
      </Tooltip>)}
    </Box>
  )
}
