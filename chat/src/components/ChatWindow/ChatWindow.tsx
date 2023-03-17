import { Box, Link, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react'
import { webSocket } from '../../webSocketConfig'
import { useAppSelector, useAppDispatch } from '../../hooks';
import styles from '../../styles/ChatWindow.module.css'
import { useUser } from '../../UserProvider';
import { addMessage } from '../../features/messages/messagesSlice';


export default function ChatWindow(): JSX.Element {
  const user = useUser();
  const message = useAppSelector((state) => state.messages.messages)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const [jsonData, setJsonData] = useState(message);
  const [messRec, setMessRec] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    console.log(message);
    const ws = webSocket;
    setMessRec(false);
    if (ws) {
      const open = () => {
        console.log('WebSocket connected');
      }
      ws.addEventListener('open', open);

      const onMessage = (event: MessageEvent<Blob>) => {
        console.log(`Received message: `, event);
        const reader = new FileReader();
        reader.onload = (event) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const data = JSON.parse(event.target?.result as string);
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
            setJsonData(data);
          } catch (error) {
            console.error('Błąd podczas konwersji Blob do JSON:', error);
          }
          console.log('To jest sparsowana wiadomość JSON: ', data);
          // dispatch(addMessage({
          //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          //   messageID: data.messageID,
          //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          //   senderID: user?._id,
          //   chatID: { id: 1 },
          //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          //   message: data?.message,
          //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
          //   timestamp: new Date(data?.timestamp),
          // }))
          setMessRec(true);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          console.log('To jest wiadomość z dispatcha: ', data?.timestamp, typeof data?.timestamp);
        };
        reader.readAsText(event.data);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

        
      }
      ws.addEventListener('message', onMessage);
      return () => {
        ws.removeEventListener('open', open);
        ws.removeEventListener('message', onMessage)
      };
    }
  }, []);
  return (
    <Link>
      <Box className={styles.main}>
        <Box>{user?.nick}</Box>
        {message.slice(1).map(mess => <Tooltip title={mess.timestamp.toDateString()}>
          <Box className={styles.messageBox}>{mess.message}</Box>
        </Tooltip>)}
      </Box>
    </Link>
  )
}
