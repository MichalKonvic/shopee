import { useRouter } from 'next/router'
import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import PageLoader from './PageLoader';
const PrivateRoute = ({ children, adminOnly = false, redirect = "/login" }: {
    children: any,
    adminOnly: boolean,
    redirect?: string
}) => {
    const router = useRouter();
    const { isLoading, isLoggedIn, user } = useContext(AuthContext);


    if (!isLoggedIn && !isLoading) {
        router.push(redirect);
    }
    if (adminOnly && !user.isAdmin && !isLoading) {
        router.push(redirect);
    }
    if (isLoggedIn && !isLoading) {
        return <>{children}</>
    } else {
        return <><PageLoader /></>
    }
}
export default PrivateRoute