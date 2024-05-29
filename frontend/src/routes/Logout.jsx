import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../components/AuthProvider';

const LogOut = () => {
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        logout();
    }, [logout]);

    return null; // This component does not render anything
}

export default LogOut;
