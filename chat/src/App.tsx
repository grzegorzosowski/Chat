import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { store } from './store';
import { apiSlice } from './features/api/apiSlice';
import { ApiProvider } from '@reduxjs/toolkit/dist/query/react';
import Layout from './components/Layout';
import { CurrentThemeProvider } from './features/currentThemeProvider';
import { UserProvider } from './UserProvider';

export default function App() {
  return (
    <ApiProvider api={apiSlice}>
      <Provider store={store}>
        <CurrentThemeProvider>
          <UserProvider>
            <SnackbarProvider maxSnack={3} autoHideDuration={3000} style={{ fontFamily: 'Roboto, sans-serif' }} >
              <Layout />
            </SnackbarProvider>
          </UserProvider>
        </CurrentThemeProvider>
      </Provider>
    </ApiProvider>
  );
}

