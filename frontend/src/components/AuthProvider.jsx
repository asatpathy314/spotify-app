import { createContext, useState } from "react"

export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null)
    const [userID, setUserID] = useState(null)
    return (
        <AuthContext.Provider value={{token, setToken, userID, setUserID}}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider