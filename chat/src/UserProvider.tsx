import React from 'react';
import { useContext, useEffect, useState, createContext } from 'react';

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

interface UserProviderType {
    children: React.ReactNode
}

export function UserProvider({ children }: UserProviderType) {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | undefined>();


    useEffect(() => {
        setIsLoading(true);
        fetch('api/user', { method: 'GET' })
            .then((res) => res.json() as Promise<User>)
            .then((user) => {
                setUser(user);
            })

            .catch((err) => {
                console.warn('User fetch error', err);
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        console.log('USER', user);
    }, [user]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <Context.Provider value={user}>{children}</Context.Provider>;
}
