import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import styles from '../../styles/CreateAccountModal.module.css'
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputPassword from '../InputPassword/InputPassword';
import { useCreateAccountMutation } from '../../features/api/apiSlice';
import { useSnackbar } from 'notistack';
interface FormState {
    userEmail: string;
    userNick: string;
    userPassword: string;
    userPasswordRepeat: string;
}

export function CreateAccountModal() {
    const [form, setForm] = useState<FormState>({ userEmail: '', userNick: '', userPassword: '', userPasswordRepeat: '' });
    const [open, setOpen] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [createAccountFetch] = useCreateAccountMutation();
    const handleOpen = () => {
        setForm({ userEmail: '', userNick: '', userPassword: '', userPasswordRepeat: '' });
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }

    const createAccount = () => {
        createAccountFetch({
            userEmail: form.userEmail,
            userNick: form.userNick,
            userPassword: form.userPassword
        })
            .unwrap()
            .then((result) => {
                console.log('Account created: ', result);
                enqueueSnackbar('Account created', { variant: 'success' });
                handleClose();
            })
            .catch((error) => {

                console.log(error);
            })
    }

    const handleSubmit = (event: React.FormEvent<Element>) => {
        event.preventDefault();
        if (form.userPassword === form.userPasswordRepeat) {
            void createAccount();
        } else {
            enqueueSnackbar('Passwords are not the same', { variant: 'error' });
        }
    }


    return (
        <Box>
            <Button onClick={handleOpen} variant='outlined' sx={{ position: 'fixed', left: '10px', top: '10px' }}>Create account</Button>
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
                                value={form.userEmail}
                                onChange={(event) => setForm({ ...form, userEmail: event.target.value })}
                                label="Email"
                                type="email"
                                size="small"
                            ></TextField>
                            <TextField
                                className={styles.input}
                                value={form.userNick}
                                onChange={(event) => setForm({ ...form, userNick: event.target.value })}
                                label="Nick"
                                type="text"
                                size="small"
                            ></TextField>
                            <InputPassword
                                value={form.userPassword}
                                onChange={(event) => setForm({ ...form, userPassword: event.target.value })}
                                text={'Password'}
                            ></InputPassword>
                            <InputPassword
                                value={form.userPasswordRepeat}
                                onChange={(event) => setForm({ ...form, userPasswordRepeat: event.target.value })}
                                text={'Password'}
                            ></InputPassword>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                sx={{ px: 5, mt: 1 }}
                            >
                                CREATE
                            </Button>
                        </Box>
                    </>
                </Box>

            </Modal >
        </Box >
    );
}