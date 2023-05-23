import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { store } from './store';
import { apiSlice } from './features/api/apiSlice';
import { ApiProvider } from '@reduxjs/toolkit/dist/query/react';
import { CurrentThemeProvider } from './features/currentThemeProvider';
import Layout from './components/Layout';

export default function App() {
  return (
    <ApiProvider api={apiSlice}>
      <Provider store={store}>
        <CurrentThemeProvider>
          <SnackbarProvider maxSnack={3} autoHideDuration={3000} >
            <Layout />
          </SnackbarProvider>
        </CurrentThemeProvider>
      </Provider>
    </ApiProvider>
  );
}

