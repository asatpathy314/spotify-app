import { createContext, useState } from "react"

export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState();
    const [userID, setUserID] = useState();
    return (
        <AuthContext.Provider value={{token, setToken, userID, setUserID}}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider