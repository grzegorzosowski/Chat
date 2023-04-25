import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styles from '../../styles/CreateChatModal.module.css'
import buttonStyle from '../../styles/ChatOption.module.css'
import { useUser } from '../../UserProvider';
import { useEffect, useState } from 'react';
import { Link } from '@mui/material';
import { useCreateChatMutation } from '../../features/api/apiSlice';
import { enqueueSnackbar } from 'notistack';

interface User {
    _id: string;
    nick: string;
}

interface UsersList {
    users: Array<User>;
    groupChats: Array<string>;
}

export default function CreateChatModal() {
    const user = useUser();
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [newChatUsers, setNewChatUsers] = useState<Array<User>>([]);
    const [newChatName, setNewChatName] = useState<string>('');
    const [usersFetched, setUsersFetched] = useState<boolean>(false);
    const [createChat] = useCreateChatMutation();
    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setNewChatUsers([]);
        setNewChatName('');
        setOpen(false);
    }


    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nick: user?.nick } as Record<string, unknown>),
    };
    useEffect(() => {
        function getUsers() {
            fetch('/api/getUsers', requestOptions)
                .then((response) => response.json())
                .then((data: UsersList) => { setUsers(data?.users) })
                .catch((error) => console.log(error));
        }
        if (!usersFetched) {
            getUsers();
            setUsersFetched(true);
        }
    }, []);

    const handleSubmit = () => {
        if (newChatUsers.length === 0) {
            enqueueSnackbar('No users checked', { variant: 'error' });
        } else if (!newChatName) {
            enqueueSnackbar('No chat name', { variant: 'error' });
        } else {
            createChat({
                chatName: newChatName,
                members: newChatUsers,
                createdBy: user?._id as string
            })
                .unwrap()
                .then((result) => {
                    console.log('Result: ', result)
                    window.location.reload();
                })
                .catch((error) => console.log('Error: ', error));
        }

    }

    const handleClick = (userLink: User) => {
        console.log('Kliknięto na: ', userLink._id);
        console.log('Name of chat: ', newChatName);
        if (!newChatUsers.find((user: User) => user._id === userLink._id)) {
            setNewChatUsers([...newChatUsers, userLink]);
        } else {
            setNewChatUsers(newChatUsers.filter((user: User) => user._id !== userLink._id));
        }
    }

    return (
        <Box>
            <Button onClick={handleOpen} size='small' className={buttonStyle.buttonStyle} >Create group chat</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={styles.modalStyle}>
                    <Typography variant='h6' className={styles.title} >CREATE GROUP CHAT</Typography>
                    <Box value={newChatName} component='input' placeholder='Chat name' className={styles.inputStyle} onChange={(event) => setNewChatName(event.target.value)} />
                    <Typography id="modal-modal-description">
                        Add users to chat:
                    </Typography>

                    <Box className={styles.userList}>
                        {users.length > 0 ?
                            <>{usersFetched && users && users.map((user: User) =>
                                <Link key={user._id} className={styles.checkUserLink} onClick={() => handleClick(user)}>
                                    {newChatUsers.includes(user)
                                        ? <Box className={styles.linkDistance}><CheckCircleIcon className={styles.userChecked} /><Box>{user.nick}</Box></Box>
                                        : <Box className={styles.linkDistance}><CheckCircleIcon sx={{ visibility: 'hidden' }} className={styles.userChecked} /><Box>{user.nick}</Box></Box>
                                    }
                                </Link>
                            )
                            }</>
                            : <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <Typography >There is no another users</Typography>
                            </Box>
                        }
                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{ display: 'block', px: 5, m: '15px auto 0 auto' }}
                        onClick={handleSubmit}>CREATE</Button>
                </Box>

            </Modal>
        </Box>
    );
}