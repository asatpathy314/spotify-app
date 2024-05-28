import { useContext, useEffect } from "react"
import { useSearchParams, useParams } from "react-router-dom"
import { AuthContext } from "../components/AuthProvider"

const Profile = () => {
    const { token, setToken, userID, setUserID } = useContext(AuthContext)
    const [searchParams, setSearchParams] = useSearchParams()
    useEffect(() => {
        console.log(searchParams.get('access_token'))
        setToken(searchParams.get('access_token'))
        console.log(searchParams.get('user_id'))
        setUserID(searchParams.get('user_id'))
    }, [searchParams, setToken, setUserID])

    return (
        <h1>profile</h1>
    )
}

export default Profile