import React from 'react';
import { useContext, useEffect, useState, createContext } from 'react';

const Context = createContext<Record<string, any> | undefined>(undefined);

export function useUser() {
    return useContext(Context);
}

interface UserProviderType {
    children: React.ReactNode
}

export function UserProvider({ children }: UserProviderType) {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<Record<string, any> | undefined>();
    

    useEffect(() => {
        setIsLoading(true);
        fetch('api/user', {method: 'GET'})
            .then((res) => res.json() as Promise<Record<string, any>>)
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
