import { Routes, Route } from 'react-router-dom'
import ChatPage from './components/ChatPage/ChatPage';
import LoginPage from './components/LoginPage/LoginPage';
import styles from './styles/Home.module.css'
import { useUser } from './UserProvider';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { SnackbarProvider } from 'notistack';
import { Button } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import React from 'react'
export default function App() {
  const user = useUser();
  const isUser = !!user;
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
    <Provider store={store}>
      <main className={styles.main}>
        <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
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
          </Routes>
        </SnackbarProvider>
        <Button onClick={handleClick}>Logout</Button>
      </main>
    </Provider>
  );
}

