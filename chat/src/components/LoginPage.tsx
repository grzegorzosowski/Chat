import React, { useState } from 'react'
import Box from '@mui/material/Box';
import { useSnackbar } from 'notistack';
import { TextField } from '@mui/material';
import InputPassword from './InputPassword';
import Button from '@mui/material/Button'
import { useIsMobile } from '../features/useIsMobile';

interface FormState {
  userEmail: string;
  userPassword: string;
}

export default function LoginPage() {
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = (email: string, password: string) => {
    const send = async () => {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      };

      try {
        const res = await fetch('api/login/password', requestOptions);
        console.log('STATUS', res.status);
        const success = res.status === 200;
        if (success) {
          window.location.replace('/chat');
        } else {
          enqueueSnackbar('Wrong password', { variant: 'error' });
        }
      } catch (error) {
        console.log('Some error during logging');
        console.error(error);
      }
    }
    send().catch(e => console.warn(e))
  };

  return <LoginForm handleSubmit={handleSubmit} />
}

export function LoginForm({ handleSubmit }: { handleSubmit: (email: string, password: string) => void }) {
  const [form, setForm] = useState<FormState>({ userEmail: '', userPassword: '' });
  const isMobile = useIsMobile();

  return <Box
    sx={{
      width: isMobile ? '90%' : '40%',
      margin: 'auto',
      padding: 2,
      borderRadius: 2,
    }}
  >
    <Box component="form" data-testid="loginForm" onSubmit={(e) => {
      e.preventDefault()
      handleSubmit(form.userEmail, form.userPassword)
    }} sx={{ display: 'flex', flexDirection: 'column' }}>
      <TextField
        value={form.userEmail}
        onChange={(event) => setForm({ ...form, userEmail: event.target.value })}
        label="Email"
        type="email"
        size="small"
        sx={{ mb: 2 }}
      />
      <InputPassword
        value={form.userPassword}
        label="Password"
        data-testid="password"
        onChange={(event) => setForm({ ...form, userPassword: event.target.value })}
        text={'Password'}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        sx={{ px: 5, mt: 3 }}
        disabled={form.userEmail === "" || form.userPassword === ""}
      >
        Login
      </Button>
    </Box>
  </Box>
}