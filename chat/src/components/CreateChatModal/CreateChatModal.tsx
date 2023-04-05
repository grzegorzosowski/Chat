import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import styles from '../../styles/CreateChatModal.module.css'
import { useUser } from '../../UserProvider';
import { useEffect, useState } from 'react';
import { Link } from '@mui/material';
import { useCreateChatMutation } from '../../features/api/apiSlice';

interface User {
    _id: string;
    nick: string;
}

export default function CreateChatModal() {
    const user = useUser();
    const [open, setOpen] = React.useState(false);
    const [users, setUsers] = useState([]);
    const [newChatUsers, setNewChatUsers] = useState<Array<User>>([]);
    const [newChatName, setNewChatName] = useState<string>('');
    const [usersFetched, setUsersFetched] = useState<boolean>(false);
    const [createChat] = useCreateChatMutation();
    const handleOpen = () => {
        setOpen(true); 
    }
    const handleClose = () => {
        setNewChatUsers([]);
        setOpen(false);
    }


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
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                .then((data) => { setUsers(data.users) })
                .catch((error) => console.log(error));
        }
        if (!usersFetched) {
            getUsers();
            setUsersFetched(true);
        }
    }, []);

    const handleSubmit = () => {
        console.log('Lista wybranych użytkowników: ', newChatUsers);
        createChat({
            chatName: newChatName,
            members: newChatUsers,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            createdBy: user?._id,
        })
            .unwrap()
            .then((result) => console.log('Result: ', result))
            .catch((error) => console.log('Error: ', error));

    }

    const handleClick = (userLink: User) => {
        console.log('Kliknięto na: ', userLink._id);
        console.log('Name of chat: ', newChatName);
        if (!newChatUsers.find((user: User) => user._id === userLink._id)) {
            setNewChatUsers([...newChatUsers, userLink]);
        }
    }

    return (
        <Box>
            <Button onClick={handleOpen}>Create group chat</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={styles.modalStyle}>
                    <>
                        <Box value={newChatName} component='input' placeholder='Chat name' className={styles.inputStyle} onChange={(event) => setNewChatName(event.target.value)} />
                        {newChatUsers.map((user: User) =>
                            <Box component='span' key={user._id} className={styles.selectedUsers}>
                                {user.nick}
                            </Box>
                        )}
                        <Typography id="modal-modal-description">
                            Add users to chat:
                        </Typography>
                        {usersFetched && users && users.map((user: User) =>
                            <Link key={user._id} className={styles.checkUserLink} onClick={() => handleClick(user)}>
                                <Box>{user.nick}</Box>
                            </Link>
                        )
                        }
                        <Box component='button' onClick={handleSubmit}>CREATE</Box>
                    </>
                </Box>

            </Modal>
        </Box>
    );
}