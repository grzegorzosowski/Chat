import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import styles from '../styles/CreateAccountModal.module.css'
import buttonStyle from '../styles/ChatOption.module.css'
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { useChangeAccountNickMutation } from '../features/api/apiSlice';
import { useSnackbar } from 'notistack';
import { useUser } from '../UserProvider';
import { useIsMobile } from '../features/useIsMobile';
import MobileCloseButton from './MobileView/MobileCloseButton';

export function ChangeAccountParam() {
    const user = useUser();
    const isMobile = useIsMobile();
    const [form, setForm] = useState({ userNick: user?.nick } as Record<string, unknown>);
    const [open, setOpen] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [changeNickFetch] = useChangeAccountNickMutation();


    const handleOpen = () => {
        setForm({ userNick: user?.nick });
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }

    const changeNick = () => {
        changeNickFetch({
            userNick: form.userNick
        })
            .unwrap()
            .then((result) => {
                console.log('Nick has been changed: ', result);
                enqueueSnackbar('Nick has been changed', { variant: 'success' });
                handleClose();
            })
            .catch((error) => {
                console.log(error);
            })
        window.location.reload();
    }

    const handleSubmit = (event: React.FormEvent<Element>) => {
        event.preventDefault();
        if (form.userNick !== user?.nick) {
            void changeNick();
        } else {
            enqueueSnackbar('New nick is same as old one', { variant: 'error' });
        }
    }


    return (
        <Box>
            <Button onClick={handleOpen} className={buttonStyle.buttonStyle}>Change my nick</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: isMobile ? '80%' : '400px',
                    backgroundColor: 'white',
                    border: '2px solid #000',
                    boxShadow: '24px',
                    padding: '20px',
                    borderRadius: '5px',
                }}>
                    <>
                        <MobileCloseButton handleClose={handleClose}></MobileCloseButton>
                        <Box component='form' onSubmit={handleSubmit} className={styles.form}>
                            <TextField
                                className={styles.input}
                                value={form.userNick}
                                onChange={(event) => setForm({ ...form, userNick: event.target.value })}
                                label="Nick"
                                type="text"
                                size="small"
                            ></TextField>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                sx={{ px: 5, mt: 1 }}
                            >
                                CHANGE
                            </Button>
                        </Box>
                    </>
                </Box>

            </Modal >
        </Box >
    );
}