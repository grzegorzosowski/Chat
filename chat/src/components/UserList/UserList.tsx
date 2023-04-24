import Box from '@mui/material/Box';
import { useEffect, useState } from 'react'
import { useUser } from '../../UserProvider';
import User from '../User/User'
import styles from '../../styles/UserList.module.css'
import Link from '@mui/material/Link';
import { useAppDispatch } from '../../hooks';
import { setActiveChat, setGettingChat } from '../../features/chats/chatsSlice';
import { useFindChatMutation, useGetMessagesMutation, useFindGroupChatMutation } from '../../features/api/apiSlice';
import { putMessages } from '../../features/messages/messagesSlice';
import GroupChat from '../GroupChat/GroupChat';
import { Tooltip, Typography } from '@mui/material';
interface User {
  _id: string;
  nick: string;
}
interface GroupChat {
  _id: string;
  chatName: string;
  members: string[];
  membersNick: string[];
}

interface ResponseData {
  users: User[];
  groupChats: GroupChat[];
}
type Result = {
  _id: string;
  members: string[];
  chatName: string;
}

interface Message {
  messageID: number;
  senderID: string;
  chatID: string;
  message: string;
  timestamp: string;
}

export default function UserList(): JSX.Element {
  const user = useUser();
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<User[]>([]);
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
  const [usersFetched, setUsersFetched] = useState<boolean>(false);
  const [findChat] = useFindChatMutation();
  const [getMessages] = useGetMessagesMutation();
  const [findGroupChat] = useFindGroupChatMutation();
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nick: user?.nick, _id: user?._id } as Record<string, unknown>),
  };
  useEffect(() => {
    function getUsers() {
      fetch('/api/getUsers', requestOptions)
        .then((response) => response.json())
        .then((data: ResponseData) => { setGroupChats(data?.groupChats); setUsers(data?.users) })
        .catch((error) => console.log(error));
    }
    if (!usersFetched) {
      getUsers();
      setUsersFetched(true);
    }
  }, []);

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
    <Box className={styles.shape}>
      <Typography variant='body1' color='gray'>USERS</Typography>
      {users && users.map((user: User) => <Link key={user._id} onClick={() => handleClick(user)} underline='none' sx={{ '&:hover': { cursor: 'pointer' } }}>
        <User key={user.nick} user={user}></User>
      </Link>)}
      <Typography variant='body1' color='gray'>GROUPS</Typography>
      {groupChats && groupChats.map((groupChat: GroupChat) => <Tooltip key={groupChat._id} title={'s'}>
        <Link key={groupChat._id} onClick={() => handleClick(groupChat)} underline='none' sx={{ '&:hover': { cursor: 'pointer' } }}>
          <GroupChat groupChat={groupChat} ></GroupChat></Link>
      </Tooltip>)}
    </Box>
  )
}
