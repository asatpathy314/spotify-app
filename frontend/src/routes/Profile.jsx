import { useContext, useEffect } from "react"
import { useSearchParams, useParams } from "react-router-dom"
import { AuthContext } from "../components/AuthProvider"

const Profile = () => {
    const { token, setToken } = useContext(AuthContext)
    const [searchParams, setSearchParams] = useSearchParams()
    useEffect(() => {
        console.log(searchParams.get('access_token'))
    }, [searchParams])

    return (
        <h1>profile</h1>
    )
}

export default Profile