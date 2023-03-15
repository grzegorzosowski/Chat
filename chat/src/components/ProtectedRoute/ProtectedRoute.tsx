import React from 'react';
import { Navigate } from 'react-router';

interface ChildrenType {
    isUser: boolean
    redirectPath?: string
    children: JSX.Element
}
export const ProtectedRoute = ({ isUser, redirectPath = '/', children }: ChildrenType) => {
    if (!isUser) {
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};
