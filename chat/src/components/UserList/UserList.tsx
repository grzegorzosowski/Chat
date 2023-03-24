import Box from '@mui/material/Box';
import { useEffect, useState } from 'react'
import { useUser } from '../../UserProvider';
import User from '../User/User'
import styles from '../../styles/UserList.module.css'
import Link from '@mui/material/Link';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setActiveChat } from '../../features/chats/chatsSlice';
import { useFindChatMutation, useGetMessagesMutation } from '../../features/api/apiSlice';
import { putMessages } from '../../features/messages/messagesSlice';
interface User {
  _id: string;
  nick: string;
}

export default function UserList(): JSX.Element {
  const user = useUser();
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState([]);
  const [usersFetched, setUsersFetched] = useState<boolean>(false);
  const [findChat] = useFindChatMutation();
  const [getMessages] = useGetMessagesMutation();
  const messages = useAppSelector((state) => state.messages.messages);
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    body: JSON.stringify({ nick: user?.nick }),
  };
  useEffect(() => {
    function getUsers() {
      fetch('/api/getUsers', requestOptions)
        .then((response) => response.json())
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        .then((data) => { setUsers(data) })
        .catch((error) => console.log(error));
    }
    if (!usersFetched) {
      getUsers();
      setUsersFetched(true);
    }
  }, []);

  const handleClick = (userLink: User) => {
    console.log('Kliknięto na: ', userLink._id);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    findChat({ nick: user?.nick, nick2: userLink.nick })
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
            console.log('Wiadomości: ', result)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            dispatch(putMessages(result));
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));

  }


  return (
    <Box className={styles.shape}>
      {users && users.map((user) => <Link onClick={() => handleClick(user)} underline='none' sx={{ '&:hover': { cursor: 'pointer' } }}>
        <User key={user} user={user}></User>
      </Link>)}
    </Box>
  )
}
