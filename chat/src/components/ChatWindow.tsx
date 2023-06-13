import { Box, Tooltip, Typography } from '@mui/material';
import { useEffect, useRef, useState, useCallback } from 'react'
import { webSocket } from '../webSocketConfig'
import { useAppSelector, useAppDispatch } from '../hooks';
import { useUser } from '../UserProvider';
import { addMessage } from '../features/messages/messagesSlice';
import CircularProgress from '@mui/material/CircularProgress';
import { useGetUserNickMutation } from '../features/api/apiSlice';
import blobToString from './lib/blobToString';
import isServerMessage from './lib/isServerMessage';


function useChatConnection() {
  const dispatch = useAppDispatch();
  const message = useAppSelector((state) => state.messages.messages)
  const activeChat = useAppSelector((state) => state.activeChat.activeChat);

  const handleNewMessage = useCallback((data: string) => {
    const serverData: unknown = JSON.parse(data)
    if (!isServerMessage(serverData)) {
      console.error("Incorrect server data");
      return;
    }

    if (serverData.type === 'message') {
      if (serverData.content.chatID === activeChat.chatID) {
        dispatch(addMessage({
          messageID: serverData.content.messageID,
          senderID: serverData.content.senderID,
          chatID: serverData.content.chatID,
          message: serverData.content?.message,
          timestamp: new Date(serverData.content?.timestamp).getTime(),
        }))
      }
    }
  }, [dispatch, activeChat])

  useEffect(() => {
    const ws = webSocket;

    const onOpen = () => {
      console.log('WebSocket connected');
    }
    ws.addEventListener('open', onOpen);

    const onMessage = (event: MessageEvent<Blob>) => {
      blobToString(event.data)
        .then(str => handleNewMessage(str))
        .catch(err => console.error(err));
    }
    ws.addEventListener('message', onMessage);
    return () => {
      ws.removeEventListener('open', onOpen);
      ws.removeEventListener('message', onMessage)
    };

  }, [dispatch, message]);
}

export default function ChatWindow(): JSX.Element {
  const user = useUser();
  const [userNick, setUserNick] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const message = useAppSelector((state) => state.messages.messages)
  const activeChat = useAppSelector((state) => state.activeChat.activeChat);
  const gettingChat = useAppSelector((state) => state.activeChat.gettingChat);
  const [getUserNick] = useGetUserNickMutation();

  useChatConnection()

  useEffect(() => {
    //scroll down when new message comes
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [message])


  const onTooltipOpen = async (data: string) => {
    setUserNick('');
    await getUserNick({ userID: data })
      .unwrap()
      .then((res: string) => {
        setUserNick(res);
      })
      .catch(() => {
        setUserNick('Error');
      })
  }
  return (
    <>
      {gettingChat ? <Loader /> :
        <Box ref={containerRef} sx={{
          position: 'relative',
          backgroundColor: 'aliceblue',
          opacity: '0.8',
          color: 'black',
          height: '100%',
          width: '100%',
          padding: '1rem',
          boxSizing: 'border-box',
          borderRadius: '10px 10px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          flexFlow: 'column nowrap',
          overflowY: 'auto',
          "& :first-of-type": {
            marginTop: 'auto !important',
          },
          "::-webkit-scrollbar": {
            width: '8px',
            backgroundColor: '#f5f5f5',
            borderRadius: '0 10px 10px 0',
          },
          "::-webkit-scrollbar-thumb": {
            backgroundColor: 'gray',
            borderRadius: '4px',
          }
        }}>
          {activeChat.chatID !== '1' && message.map(mess =>
            <Tooltip
              key={mess.messageID}
              title={userNick !== '' &&
                <>
                  <Typography variant="caption" sx={{ display: 'block' }}>{userNick}</Typography>
                  <Typography variant="caption" >{new Date(mess.timestamp).toLocaleString()}</Typography>
                </>
              }
              onOpen={() => void onTooltipOpen(mess.senderID)}>

              <Box sx={{
                backgroundColor: mess.senderID === user?._id ? '#bbd6b8' : '#f8c4c4',
                padding: '4px 10px',
                marginBottom: '5px',
                borderRadius: '10px',
                width: 'fit-content',
                alignSelf: mess.senderID === user?._id ? 'flex-end' : 'flex-start',
              }}>{mess.message}</Box>

            </Tooltip>)}
        </Box>
      }
    </>
  )
}

const Loader = () => {
  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center ',
      alignItems: 'center',
      backgroundColor: 'aliceblue',
      opacity: '0.8',
      borderRadius: '10px',
    }}>
      <CircularProgress size={50} />
    </Box>
  )
}

