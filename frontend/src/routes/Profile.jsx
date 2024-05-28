import { useContext, useEffect, useState } from "react"
import { useSearchParams} from "react-router-dom"
import { AuthContext } from "../components/AuthProvider"
import { Heading } from "@chakra-ui/react"

const Profile = () => {
    const { token, setToken, userID, setUserID } = useContext(AuthContext)
    const [searchParams, setSearchParams] = useSearchParams()
    const [forbidden, setForbidden] = useState(null)

    useEffect(() => {
        if (token===null || userID===null) {
            if (searchParams.get('access_token') && searchParams.get('user_id')) {
                setToken(searchParams.get('access_token'))
                setUserID(searchParams.get('user_id'))
            }
            else {
                setForbidden(true)
                window.location.replace("/forbidden")
            }
        }
    }, [searchParams, setToken, setUserID, token, userID ])
    if (!forbidden) {
        return (
            <Heading color="#FFFFFE">ERROR. You must be Authenticated to access this page.</Heading>
        )
    }
}

export default Profile