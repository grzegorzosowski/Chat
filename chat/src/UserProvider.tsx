import React from 'react';
import { useGetAuthUserQuery } from './features/api/apiSlice'
import LoadingCircle from './components/LoadingCircle';

export function useUser() {
    const { data } = useGetAuthUserQuery();
    return data;
}

type UserProviderType = {
    children: React.ReactNode
}

export function UserProvider({ children }: UserProviderType) {
    const { isLoading } = useGetAuthUserQuery(undefined, {
        skip: true, // Disable auto-refetching for this query
    });

    if (isLoading) {
        return <LoadingCircle />;
    }

    return <>{children}</>;
}
