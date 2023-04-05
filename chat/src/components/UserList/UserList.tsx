import Box from '@mui/material/Box';
import { useEffect, useState } from 'react'
import { useUser } from '../../UserProvider';
import User from '../User/User'
import styles from '../../styles/UserList.module.css'
import Link from '@mui/material/Link';
import { useAppDispatch } from '../../hooks';
import { setActiveChat } from '../../features/chats/chatsSlice';
import { useFindChatMutation, useGetMessagesMutation, useFindGroupChatMutation } from '../../features/api/apiSlice';
import { putMessages } from '../../features/messages/messagesSlice';
import GroupChat from '../GroupChat/GroupChat';
import { Tooltip } from '@mui/material';
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

export default function UserList(): JSX.Element {
  const user = useUser();
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState([]);
  const [groupChats, setGroupChats] = useState([]); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [usersFetched, setUsersFetched] = useState<boolean>(false);
  const [findChat] = useFindChatMutation();
  const [getMessages] = useGetMessagesMutation();
  const [findGroupChat] = useFindGroupChatMutation();
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    body: JSON.stringify({ nick: user?.nick, _id: user?._id }),
  };
  useEffect(() => {
    function getUsers() {
      fetch('/api/getUsers', requestOptions)
        .then((response) => response.json())
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        .then((data) => { setGroupChats(data?.groupChats); setUsers(data?.users) })
        .catch((error) => console.log(error));
    }
    if (!usersFetched) {
      getUsers();
      setUsersFetched(true);
    }
  }, []);

  const handleClick = (userLink: User | GroupChat ) => {
    console.log('Kliknięto na: ', userLink._id);
    if('nick' in userLink) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    findChat({ id1: user?._id, id2: userLink._id, nick1: user?.nick, nick2: userLink?.nick })
      .unwrap()
      .then((result) => {
        const newChat = {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          chatID: result?._id,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          members: result?.members,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          chatName: result?.chatName,
        };
        dispatch(setActiveChat(newChat));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        getMessages({ chatID: newChat.chatID })
          .unwrap()
          .then((result) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            dispatch(putMessages(result));
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      findGroupChat({groupChatID: userLink._id})
      .unwrap()
      .then((result) => {
        console.log(result)
        const newChat = {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          chatID: result?._id,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          members: result?.members,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          chatName: result?.chatName,
        };
        dispatch(setActiveChat(newChat));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        getMessages({ chatID: newChat.chatID })
          .unwrap()
          .then((result) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            dispatch(putMessages(result));
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
    }
  }


  return (
    <Box className={styles.shape}>
      {users && users.map((user: User) => <Link key={user._id} onClick={() => handleClick(user)} underline='none' sx={{ '&:hover': { cursor: 'pointer' } }}>
        <User key={user.nick} user={user}></User>
      </Link>)}
      {groupChats && groupChats.map((groupChat: GroupChat) => <Tooltip key={groupChat._id} title={'s'}>
        <Link key={groupChat._id} onClick={() => handleClick(groupChat)}  underline='none' sx={{ '&:hover': { cursor: 'pointer' } }}>
          <GroupChat groupChat={groupChat} ></GroupChat></Link>
      </Tooltip>)}
    </Box>
  )
}
