import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import styles from '../../styles/CreateAccountModal.module.css'
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputPassword from '../InputPassword/InputPassword';
import { useChangeAccountNickMutation } from '../../features/api/apiSlice';
import { useSnackbar } from 'notistack';
import { useUser } from '../../UserProvider';
interface FormState {
    userNick: string;
}

export function ChangeAccountParam() {
    const user = useUser();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [form, setForm] = useState<FormState>({ userNick: user?.nick});
    const [open, setOpen] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [changeNickFetch] = useChangeAccountNickMutation();
    const handleOpen = () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        setForm({userNick: user?.nick});
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
            <Button onClick={handleOpen}>Change Nick</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={styles.modalStyle}>
                    <>
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