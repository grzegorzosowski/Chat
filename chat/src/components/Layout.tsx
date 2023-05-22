import NavBar from './NavBar'
import { Box, Link } from '@mui/material'
import { useUser } from '../UserProvider';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import LoginPage from './LoginPage';
import ChatPage from './ChatPage';
import ErrorPage from './ErrorPage/ErrorPage';
import Footer, { FOOTER_HEIGHT } from './Footer';
import Profile from './Profile/Profile';



export default function Layout() {
    const user = useUser();
    const isUser = !!user;
    return (
        <>
            <Box sx={{ minHeight: `calc(100vh - ${FOOTER_HEIGHT}px)` }}>
                <header>
                    <NavBar />
                </header>
                <main>
                    <Box>
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
                            <Route path='/profile' element={
                                <ProtectedRoute isUser={isUser}>
                                    <Profile />
                                </ProtectedRoute>
                            } />
                            <Route path='/emailConfirmed' element={
                                <><div>Email has been confrimed</div>
                                    <Link
                                        href='/'
                                        sx={{
                                            fontSize: '1.5rem',
                                            color: '#1976d2',
                                        }}>Go back to home page</Link></>
                            } />
                            <Route path='*' element={
                                <ErrorPage />
                            } />
                        </Routes>
                    </Box>
                </main>
            </Box>
            <footer>
                <Footer />
            </footer>
        </>
    )
}
