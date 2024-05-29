import { createContext, useState, useEffect } from "react";

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

    return (
        <AuthContext.Provider value={{ token, setToken, userID, setUserID }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
