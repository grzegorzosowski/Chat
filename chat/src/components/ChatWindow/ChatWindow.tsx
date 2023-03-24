import { Box, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react'
import { webSocket } from '../../webSocketConfig'
import { useAppSelector, useAppDispatch } from '../../hooks';
import styles from '../../styles/ChatWindow.module.css'
import { useUser } from '../../UserProvider';
import { addMessage } from '../../features/messages/messagesSlice';

interface MessageData {
  messageID: number;
  senderID: string;
  chatID: string;
  message: string;
  timestamp: string;
}


export default function ChatWindow(): JSX.Element {
  const user = useUser();
  const message = useAppSelector((state) => state.messages.messages)
  const activeChat = useAppSelector((state) => state.activeChat.activeChat);
  const dispatch = useAppDispatch();
  useEffect(() => {
    console.log('Messages from store: ',message);
    const ws = webSocket;
    if (ws) {
      const open = () => {
        console.log('WebSocket connected');
      }
      ws.addEventListener('open', open);

      const onMessage = (event: MessageEvent<string>) => {
        const data = JSON.parse(event.data, undefined) as MessageData;
          console.log('message : ', data);
          dispatch(addMessage({
            messageID: data.messageID,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            senderID: user?._id,
            chatID: data.chatID,
            message: data?.message,
            timestamp: new Date(data?.timestamp),
          }))
      }
      ws.addEventListener('message', onMessage);
      return () => {
        ws.removeEventListener('open', open);
        ws.removeEventListener('message', onMessage)
      };
    }
  }, [dispatch, message]);


  return (
    <Box className={styles.main}>
      {activeChat.chatID !== '1' && message.map(mess => <Tooltip key={mess.messageID} title={mess.timestamp.toString()}>
        {mess.senderID === user?._id ?
          <Box className={styles.myMessage}>{mess.message}</Box> :
          <Box className={styles.othersMessage}>{mess.message}</Box>
        }
      </Tooltip>)}
    </Box>
  )
}

