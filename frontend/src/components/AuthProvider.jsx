import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token') || '');
    const [userID, setUserID] = useState(() => localStorage.getItem('userID') || '');

    useEffect(() => {
        localStorage.setItem('token', token);
    }, [token]);

    useEffect(() => {
        localStorage.setItem('userID', userID);
    }, [userID]);

    const logout = () => {
        setToken('');
        setUserID('');
        localStorage.clear();
        window.location.href='/';
    };

    return (
        <AuthContext.Provider value={{ token, setToken, userID, setUserID, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
