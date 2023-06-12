import React from 'react';
import { useContext, useEffect, useState, createContext } from 'react';
import LoadingPage from './components/LoadingPage';
import { useGetAuthUserQuery } from './features/api/apiSlice'

export type User = {
    _id: string;
    nick: string;
    email: string;
    verified: boolean;
}

const Context = createContext<User | undefined>(undefined);

export function useUser() {
    return useContext(Context);
}

type UserProviderType = {
    children: React.ReactNode
}

export function UserProvider({ children }: UserProviderType) {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | undefined>();

    //const authUser = useGetAuthUserQuery({}).data as User
    //useEffect to check by Chris
    useEffect(() => {
        // setIsLoading(true);
        // setUser(authUser)
        // setIsLoading(false)

        fetch('api/user', { method: 'GET' })
            .then((res) => res.json() as Promise<User>)
            .then((user) => {
                setUser(user);
            })
            .catch(() => {
                setUser(undefined)
            })
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return <LoadingPage />;
    }

    return <Context.Provider value={user}>{children}</Context.Provider>;
}
