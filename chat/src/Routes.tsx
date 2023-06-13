import { Route, Routes as ReactRouterRoutes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Link } from '@mui/material'
import { lazy } from 'react'
import { useUser } from './UserProvider';
import { Suspense, PropsWithChildren } from 'react'
import LoadingCircle from './components/LoadingCircle';

const LoginPage = lazy(() => import('./components/LoginPage'));
const ChatPage = lazy(() => import('./components/ChatPage'));
const ErrorPage = lazy(() => import('./components/ErrorPage/ErrorPage'));
const Profile = lazy(() => import('./components/Profile/Profile'));

export function LazyLoaded({ children }: PropsWithChildren<unknown>) {
    return (
        <Suspense fallback={<LoadingCircle />}>
            {children}
        </Suspense>
    )
}

export function Routes() {
    const user = useUser();
    const isUser = !!user;

    return <ReactRouterRoutes>
        <Route path='/' element={
            <ProtectedRoute isUser={!isUser} redirectPath={'/chat'} >
                <LazyLoaded>
                    <LoginPage />
                </LazyLoaded>
            </ProtectedRoute>}
        />
        <Route path='/chat' element={
            <ProtectedRoute isUser={isUser}>
                <LazyLoaded>
                    <ChatPage />
                </LazyLoaded>
            </ProtectedRoute>
        } />
        <Route path='/profile' element={
            <ProtectedRoute isUser={isUser}>
                <LazyLoaded>
                    <Profile />
                </LazyLoaded>
            </ProtectedRoute>
        } />
        <Route path='/emailConfirmed' element={
            <LazyLoaded>
                <><div>Email has been confrimed</div>
                    <Link
                        href='/'
                        sx={{
                            fontSize: '1.5rem',
                            color: '#1976d2',
                        }}>Go back to home page</Link></>
            </LazyLoaded>
        } />
        <Route path='*' element={
            <ErrorPage />
        } />
    </ReactRouterRoutes>
}