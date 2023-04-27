import React, { useState } from 'react'
import Box from '@mui/material/Box';
import { useSnackbar } from 'notistack';
import { TextField } from '@mui/material';
import InputPassword from '../InputPassword/InputPassword';
import Button from '@mui/material/Button'
import { useIsMobile } from '../../features/useIsMobile';

interface FormState {
  userEmail: string;
  userPassword: string;
}

export default function LoginPage() {
  const [form, setForm] = useState<FormState>({ userEmail: '', userPassword: '' });
  const { enqueueSnackbar } = useSnackbar();
  const isMobile = useIsMobile();
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      username: form.userEmail,
      password: form.userPassword,
    }),
  };
  const logUser = async () => {
    try {
      const res = await fetch('api/login/password', requestOptions);
      const success = res.status === 200;
      if (success) {
        await fetch('api/user', { method: 'GET' });
        window.location.replace('/chat');
      } else {
        enqueueSnackbar('Wrong password', { variant: 'error' });
      }
    } catch (error) {
      console.log('Some error during logging');
      console.error(error);
    }
  };

  const handleSubmit = (e: React.FormEvent<Element>) => {
    e.preventDefault();
    console.log('Button wcisniety')
    void logUser();
  };

  return (
    <Box
      sx={{
        width: isMobile ? '90%' : '40%',
        margin: 'auto',
        bgcolor: 'white',
        padding: 2,
        borderRadius: 2,
      }}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column' }}>
        <TextField
          value={form.userEmail}
          onChange={(event) => setForm({ ...form, userEmail: event.target.value })}
          label="Email"
          type="email"
          size="small"
          sx={{ mb: 2 }}
        ></TextField>
        <InputPassword
          value={form.userPassword}
          onChange={(event) => setForm({ ...form, userPassword: event.target.value })}
          text={'Password'}
        ></InputPassword>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          sx={{ px: 5, mt: 3 }}
        >
          Login
        </Button>
      </Box>
    </Box>
  )
}

