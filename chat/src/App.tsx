import React from 'react';
import { Routes, Route } from 'react-router-dom'
import ChatPage from './components/ChatPage/ChatPage';
import LoginPage from './components/LoginPage/LoginPage';
import styles from './styles/Home.module.css'
import { useUser } from './UserProvider';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';

function App() {
  const user = useUser();
  const isUser = !!user;
  return (
    <main className={styles.main}>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/chat' element={
          <ProtectedRoute isUser={isUser}>
            <ChatPage />
          </ProtectedRoute>
        } />
      </Routes>
    </main>
  );
}

export default App;
