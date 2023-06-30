import { Box, Tooltip, Typography } from '@mui/material';
import { useEffect, useRef, useState, useCallback } from 'react'
import { webSocket } from '../webSocketConfig'
import { useAppSelector, useAppDispatch } from '../hooks';
import { useUser } from '../UserProvider';
import { addMessage } from '../features/messages/messagesSlice';
import { useGetUserNickQuery } from '../features/api/apiSlice';
import blobToString from './lib/blobToString';
import isServerMessage from './lib/isServerMessage';
import LoadingCircle from './LoadingCircle';


export default function ChatWindow(): JSX.Element {
  const user = useUser();

  const containerRef = useRef<HTMLDivElement>(null);
  const message = useAppSelector((state) => state.messages.messages)
  const activeChat = useAppSelector((state) => state.activeChat.activeChat);
  const gettingChat = useAppSelector((state) => state.activeChat.gettingChat);
  const [senderId, setSenderId] = useState<string | undefined>()
  const { data: userNick, isFetching: userNickIsFetching } = useGetUserNickQuery(senderId as string, {
    skip: senderId == null
  });

  useChatConnection()

  useEffect(() => {
    //scroll down when new message comes
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [message])


  return (
    <>
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
        {gettingChat ? <LoadingCircle /> : activeChat.chatID !== '1' && message.map(mess =>
          <Tooltip
            key={mess.timestamp}
            title={userNick !== '' && !userNickIsFetching &&
              <>
                <Typography variant="caption" sx={{ display: 'block' }}>{userNick}</Typography>
                <Typography variant="caption" >{new Date(mess.timestamp).toLocaleString()}</Typography>
              </>
            }
            onOpen={() => setSenderId(mess.senderID)}>

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
    </>
  )
}

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
