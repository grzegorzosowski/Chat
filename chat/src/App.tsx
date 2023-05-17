import { Routes, Route } from 'react-router-dom'
import ChatPage from './components/ChatPage';
import LoginPage from './components/LoginPage';
import { useUser } from './UserProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SnackbarProvider } from 'notistack';
import { Box } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import { apiSlice } from './features/api/apiSlice';
import { ApiProvider } from '@reduxjs/toolkit/dist/query/react';
import ErrorPage from './components/ErrorPage/ErrorPage';
import { useIsMobile } from './features/useIsMobile';
import NavBar from './components/NavBar';
import { CurrentThemeProvider } from './features/currentThemeProvider';

export default function App() {
  const user = useUser();
  const isUser = !!user;
  const isMobile = useIsMobile();


  return (
    <ApiProvider api={apiSlice}>
      <Provider store={store}>
        <CurrentThemeProvider>
          <SnackbarProvider maxSnack={3} autoHideDuration={3000} >
            <NavBar></NavBar>
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
        </CurrentThemeProvider>
      </Provider>
    </ApiProvider>
  );
}

