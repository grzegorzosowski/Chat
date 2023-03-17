import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react'
import { useUser } from '../../UserProvider';
import User from '../User/User'
import styles from '../../styles/UserList.module.css'
import Link from '@mui/material/Link';

export default function UserList(): JSX.Element {
  const user = useUser();
  const [users, setUsers] = useState([]);
  const [usersFetched, setUsersFetched] = useState<boolean>(false);
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
  return (
    <Box className={styles.shape}>
      {users && users.map((user) => <Link href='#' underline='none'>
        <User key={user} user={user}></User>
      </Link>)}
    </Box>
  )
}
