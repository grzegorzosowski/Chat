import Box from '@mui/material/Box';
import { useEffect, useState } from 'react'
import { useUser } from '../UserProvider';
import User from './User'
import Link from '@mui/material/Link';
import { useAppDispatch } from '../hooks';
import { setActiveChat, setGettingChat } from '../features/chats/chatsSlice';
import { useFindChatMutation, useGetMessagesMutation, useFindGroupChatMutation, useGetUsersMutation } from '../features/api/apiSlice';
import { putMessages } from '../features/messages/messagesSlice';
import GroupChat from './GroupChat';
import { Tooltip, Typography } from '@mui/material';
import { FOOTER_HEIGHT } from './Footer';
import { useIsMobile } from '../features/useIsMobile';
import { webSocket } from '../webSocketConfig';

type User = {
  _id: string;
  nick: string;
}
type GroupChat = {
  _id: string;
  chatName: string;
  members: string[];
  membersNick: string[];
}

type ResponseData = {
  users: User[];
  groupChats: GroupChat[];
}
type Result = {
  _id: string;
  members: string[];
  chatName: string;
}

type Message = {
  messageID: number;
  senderID: string;
  chatID: string;
  message: string;
  timestamp: number;
}

type ServerMessage = {
  type: string;
  content: Array<string>;
};

export default function UserList(): JSX.Element {
  const user = useUser();
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<User[]>([]);
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
  const [usersFetched, setUsersFetched] = useState<boolean>(false);
  const [serverData, setServerData] = useState<Array<string> | null>(null);
  const [findChat] = useFindChatMutation();
  const [getMessages] = useGetMessagesMutation();
  const [findGroupChat] = useFindGroupChatMutation();
  const [getUsersList] = useGetUsersMutation();
  const ws = webSocket;

  useEffect(() => {
    const getUsers = async () => {
      await getUsersList({ _id: user?._id, nick: user?.nick })
        .unwrap()
        .then((res: ResponseData) => {
          setGroupChats(res.groupChats);
          setUsers(res.users)
        })
        .catch((err) => {
          console.error(err)
        })
    }

    ws.addEventListener('open', function () {
      ws.send(JSON.stringify('getUsers'))
    });

    if (!usersFetched) {
      void getUsers();
      setUsersFetched(true);
    }
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent<Blob>) => {
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result as string;
        const serverData = JSON.parse(data) as ServerMessage
        if (serverData.type === 'loggedUsers') {
          setServerData(serverData.content);
        }
      }
      reader.readAsText(event.data)
    }
    ws.addEventListener('message', onMessage);
    return () => {
      ws.removeEventListener('message', onMessage)
    };
  }, [serverData])

  const handleClick = (userLink: User | GroupChat) => {
    if (user == null) {
      return;
    }
    dispatch(setGettingChat(true));
    if ('nick' in userLink) {  // ### if userLink has nick property, it's a user, not group ### //
      findChat({ id1: user._id, id2: userLink._id, nick1: user.nick, nick2: userLink?.nick })
        .unwrap()
        .then((result: Result) => {
          const newChat = {
            chatID: result?._id,
            members: result?.members,
            chatName: result?.chatName,
          };
          dispatch(setActiveChat(newChat));
          getMessages({ chatID: newChat.chatID })
            .unwrap()
            .then((result: Message[]) => {
              dispatch(putMessages(result));
              dispatch(setGettingChat(false));
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    } else {
      findGroupChat({ groupChatID: userLink._id })
        .unwrap()
        .then((result: Result) => {
          const newChat = {
            chatID: result?._id,
            members: result?.members,
            chatName: result?.chatName,
          };
          dispatch(setActiveChat(newChat));
          getMessages({ chatID: newChat.chatID })
            .unwrap()
            .then((result: Message[]) => {
              dispatch(putMessages(result));
              dispatch(setGettingChat(false));
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    }
  }


  return (
    <Box sx={(theme) => ({
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'inherit',
      height: `calc(100% - ${FOOTER_HEIGHT}px - 20px)`,
      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.secondary.dark : theme.palette.divider,
      padding: '10px',
      borderRadius: isMobile ? '10px' : '0 10px 10px 0',
    })}>
      <Typography variant='body1'>USERS</Typography>
      {users && users.map((user: User) => <Link key={user._id} onClick={() => handleClick(user)} underline='none' sx={{ '&:hover': { cursor: 'pointer' } }}>
        <User key={user.nick} user={user} isLogged={serverData?.includes(user._id)}></User>
      </Link>)}
      {groupChats.length > 0 && <Typography variant='body1' gutterBottom>GROUPS</Typography>}
      {groupChats && groupChats.map((groupChat: GroupChat) => <Tooltip key={groupChat._id} title={'Hint'}>
        <Link key={groupChat._id} onClick={() => handleClick(groupChat)} underline='none' sx={{ '&:hover': { cursor: 'pointer' } }}>
          <GroupChat groupChat={groupChat} ></GroupChat></Link>
      </Tooltip>)}
    </Box>
  )
}
