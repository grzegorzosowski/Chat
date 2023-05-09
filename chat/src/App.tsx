import { Routes, Route } from 'react-router-dom'
import ChatPage from './components/ChatPage';
import LoginPage from './components/LoginPage';
import styles from './styles/Home.module.css'
import { useUser } from './UserProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SnackbarProvider } from 'notistack';
import { Box, Button } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import { apiSlice } from './features/api/apiSlice';
import { ApiProvider } from '@reduxjs/toolkit/dist/query/react';
import { CreateAccountModal } from './components/CreateAccountModal';
import ErrorPage from './components/ErrorPage/ErrorPage';
import { useIsMobile } from './features/useIsMobile';

export default function App() {
  const user = useUser();
  const isUser = !!user;
  const isMobile = useIsMobile();
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
    }),
  }
  const handleClick = () => {
    void fetchData();
  }

  const fetchData = async () => {
    await fetch('api/logout', requestOptions)
    console.log("Butto pushed")
    window.location.replace('/');
  }

  return (
    <ApiProvider api={apiSlice}>
      <Provider store={store}>
        <SnackbarProvider maxSnack={3} autoHideDuration={3000} >
          {isUser
            ? <Button onClick={handleClick} variant='outlined' color='error' className={styles.logout}>Logout</Button>
            : <CreateAccountModal></CreateAccountModal>
          }
          <Box sx={{
            margin: 'auto',
            minHeight: '80vh',
            mt: 3,
            width: isMobile ? '100%' : '60%',
            color: 'aliceblue',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'column',
          }}>

            <Routes>
              <Route path='/' element={
                <ProtectedRoute isUser={!isUser} redirectPath={'/chat'} >
                  <LoginPage />
                </ProtectedRoute>}
              />
              <Route path='/chat' element={
                <ProtectedRoute isUser={isUser}>
                  <ChatPage />
                </ProtectedRoute>
              } />
              <Route path='*' element={
                <ErrorPage />
              } />
            </Routes>
          </Box>
        </SnackbarProvider>
      </Provider>
    </ApiProvider>
  );
}

