import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { useChangeAccountNickMutation } from '../../features/api/apiSlice';
import { useSnackbar } from 'notistack';
import { useUser } from '../../UserProvider';
import { isNickValid } from '../../features/validations/nickValidation';
import NickValidator from '../validators/NickValidator';


export function ChangeNick() {
    const user = useUser();
    const isUser = !!user;
    const [form, setForm] = useState({ userNick: isUser ? user.nick : '' });
    const { enqueueSnackbar } = useSnackbar();
    const [changeNickFetch] = useChangeAccountNickMutation();

    const changeNick = () => {
        changeNickFetch({
            userNick: form.userNick
        })
            .unwrap()
            .then((result) => {
                console.log('Nick has been changed: ', result);
                enqueueSnackbar('Nick has been changed', { variant: 'success' });
            })
            .catch((error) => {
                console.log(error);
            })
        window.location.reload();
    }

    const handleSubmit = (event: React.FormEvent<Element>) => {
        event.preventDefault();
        if (form.userNick !== undefined) {
            if (form.userNick === user?.nick) {
                enqueueSnackbar('New nick is same as old one', { variant: 'error' });
            } else if (form.userNick.length < 3) {
                enqueueSnackbar('Nick is too short', { variant: 'error' });
            } else if (!isNickValid(form.userNick)) {
                enqueueSnackbar('Nick contains forbidden characters', { variant: 'error' });
            } else {
                void changeNick();
            }
        }
    }


    return (
        <Box
            component='form'
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '300px',
                width: '300px',
                margin: 'auto'
            }}>
            <TextField
                value={form.userNick}
                onChange={(event) => setForm({ ...form, userNick: event.target.value })}
                label="Nick"
                type="text"
                size="small"
                inputProps={{ maxLength: 20 }}
                sx={{
                    width: '100%',
                    mb: '10px'

                }}
            ></TextField>
            <NickValidator nick={form.userNick} />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ px: 5, mt: 2, width: '100%' }}
            >
                CHANGE
            </Button>
        </Box>
    );
}