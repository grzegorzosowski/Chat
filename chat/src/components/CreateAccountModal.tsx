import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputPassword from './InputPassword';
import { useCreateAccountMutation } from '../features/api/apiSlice';
import { useSnackbar } from 'notistack';
import PassValidator from './validators/PassValidator';
import { useIsMobile } from '../features/useIsMobile';
import MobileCloseButton from './MobileView/MobileCloseButton';
import { useTheme } from '@mui/material';
import NickValidator from './validators/NickValidator';
import { isNickValid } from '../features/validations/nickValidation';
interface FormState {
    userEmail: string;
    userNick: string;
    userPassword: string;
    userPasswordRepeat: string;
}

export function CreateAccountModal() {
    const theme = useTheme();
    const [form, setForm] = useState<FormState>({ userEmail: '', userNick: '', userPassword: '', userPasswordRepeat: '' });
    const [open, setOpen] = useState(false);
    const [validationDone, setValidationDone] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [createAccountFetch] = useCreateAccountMutation();
    const isMobile = useIsMobile();
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
                enqueueSnackbar('Account has been created', { variant: 'success' });
                handleClose();
            })
            .catch((error) => {
                console.log(error);
                enqueueSnackbar('Account has not been created ', { variant: 'error' });
            })
    }

    const handleSubmit = (event: React.FormEvent<Element>) => {
        event.preventDefault();
        if (form.userEmail === "") {
            enqueueSnackbar('Email is required', { variant: 'error' });
        } else if (form.userNick.length < 3 || !isNickValid(form.userNick)) {
            enqueueSnackbar('Nick is not valid', { variant: 'error' });
        } else if (!validationDone) {
            enqueueSnackbar('Password is not valid', { variant: 'error' });
        } else if (form.userPassword !== form.userPasswordRepeat && validationDone) {
            enqueueSnackbar('Passwords are not the same', { variant: 'error' });
        } else {
            void createAccount();
        }
    }



    return (
        <Box>
            <Button
                onClick={handleOpen}
                variant='outlined'
                sx={{
                    color: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.secondary.contrastText,
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.secondary.contrastText
                }}>Create account</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={(theme) => ({
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%)`,
                    width: isMobile ? '90%' : '350px',
                    border: '2px solid #000',
                    boxShadow: '24px',
                    padding: '10px',
                    borderRadius: '5px',
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(12, 12, 12, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                })}>
                    {isMobile && <MobileCloseButton handleClose={setOpen}></MobileCloseButton>}
                    <Box component='form' onSubmit={handleSubmit} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        boxSizing: 'border-box',
                        padding: '10px',
                    }}>
                        <TextField
                            value={form.userEmail}
                            onChange={(event) => setForm({ ...form, userEmail: event.target.value })}
                            label="Email"
                            type="email"
                            size="small"
                            sx={{
                                width: '100%',
                                height: '30px',
                                marginBottom: '20px !important',
                            }}
                        ></TextField>
                        <TextField
                            value={form.userNick}
                            onChange={(event) => setForm({ ...form, userNick: event.target.value })}
                            label="Nick"
                            type="text"
                            size="small"
                            sx={{
                                width: '100%',
                                height: '30px',
                                marginBottom: '20px !important',
                            }}
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
                        <NickValidator nick={form.userNick} />
                        <PassValidator password={form.userPassword} passwordCorrect={setValidationDone}></PassValidator>
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
                </Box>

            </Modal >
        </Box >
    );
}