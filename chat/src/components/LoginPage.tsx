import { useState } from 'react'
import Box from '@mui/material/Box';
import { useSnackbar } from 'notistack';
import { TextField } from '@mui/material';
import InputPassword from './InputPassword';
import Button from '@mui/material/Button'
import { useIsMobile } from '../features/useIsMobile';
import { useLoginUserMutation } from '../features/api/apiSlice';

type FormState = {
  userEmail: string;
  userPassword: string;
}

type IncomingData = {
  status: number;
  data: object;
}

export default function LoginPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [loginUser] = useLoginUserMutation();

  const handleSubmit = (email: string, password: string) => {

    loginUser({ username: email, password: password })
      .unwrap()
      .then((result: IncomingData) => {
        const res = result; // Extract the data from the result object
        console.log('Response', res);
        if (res.status === 200) {
          window.location.replace('/chat');
        } else if (res.status === 429) {
          enqueueSnackbar('Too many requests', { variant: 'error' });
        } else {
          enqueueSnackbar('Wrong password', { variant: 'error' });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return <LoginForm handleSubmit={handleSubmit} />;
}

export function LoginForm({ handleSubmit }: { handleSubmit: (email: string, password: string) => void }) {
  const [form, setForm] = useState<FormState>({ userEmail: '', userPassword: '' });
  const isMobile = useIsMobile();

  return <Box
    sx={{
      width: isMobile ? '90%' : '400px',
      margin: 'auto',
      mt: '200px',
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