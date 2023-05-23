import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { useChangeAccountNickMutation } from '../features/api/apiSlice';
import { useSnackbar } from 'notistack';
import { useUser } from '../UserProvider';

export function ChangeNick() {
    const user = useUser();
    const [form, setForm] = useState({ userNick: user?.nick } as Record<string, unknown>);
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
        if (form.userNick !== user?.nick) {
            void changeNick();
        } else {
            enqueueSnackbar('New nick is same as old one', { variant: 'error' });
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
                height: '300px'
            }}>
            <TextField
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
    );
}