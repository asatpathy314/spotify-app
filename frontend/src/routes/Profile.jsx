import { useContext, useEffect, useState } from "react"
import { useSearchParams} from "react-router-dom"
import { AuthContext } from "../components/AuthProvider"
import { AppAvatar } from "../components/AppAvatar"
import { Heading, Grid, GridItem, Avatar, Stack, Text, Img } from "@chakra-ui/react"
import { App } from "../App"
import axios from "axios"

const Profile = () => {
    const { token, setToken, userID, setUserID } = useContext(AuthContext)
    const [searchParams, setSearchParams] = useSearchParams()
    const [favoriteArtist, setFavoriteArtist] = useState(null)
    const [favoriteSong, setFavoriteSong] = useState(null)
    const [forbidden, setForbidden] = useState(null)

    useEffect(() => {
        if (token===null || userID===null) {
            if (searchParams.get('access_token') && searchParams.get('user_id')) {
                console.log('huge')
                setToken(searchParams.get('access_token'))
                setUserID(searchParams.get('user_id'))
            }
            else {
                setForbidden(true)
                window.location.replace("/forbidden")
                return
            }
        }
        const songParams = new URLSearchParams({
                spotify_token: token,
                num_songs: 1,
                timeframe: 'long_term'
        })
        const artistParams = new URLSearchParams({
                spotify_token: token,
                num_artists: 1,
                timeframe: 'long_term'
        })
        axios.get('http://localhost:8000/song?' + songParams.toString())
            .then(res => {
                if (res.status === 200) {
                    setFavoriteSong(res.data.items[0])
                }
                else {
                    setFavoriteSong({error: 'An Error Occurred. Please try again later.'})
                }
            })
        axios.get('http://localhost:8000/artist?' + songParams.toString())
        .then(res => {
            if (res.status === 200) {
                setFavoriteArtist(res.data.items[0])
            }
            else {
                setFavoriteArtist({error: 'An Error Occurred. Please try again later.'})
            }
        })
    }, [searchParams, setToken, setUserID, token, userID, setFavoriteArtist, setFavoriteSong])
    console.log(favoriteSong)
    console.log(favoriteArtist)
    if (!forbidden) {
        return (
            <Grid
                h='90%'
                templateRows='repeat(2, 1fr)'
                templateColumns='repeat(4, 1fr)'
                gap={4}
            >
                <GridItem colSpan={4} bg='#0f0e17' padding={10}>
                    <Stack direction={['column', 'row', 'row', 'row']} spacing={4}>
                        <Avatar
                            src='https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250'
                            size={['3xl', '3xl', '3xl', '3xl']}
                        />
                        <div>
                            <Heading size={['xl', null, null, '2xl']} color='#FFFFFE'>
                                User
                            </Heading>
                            <Heading size={['md', null, null, 'lg']} color='#FFFFFE'>
                                daniel341
                            </Heading>
                            <Text fontSize='xl' color='#FFFFFE'>
                                Hiii! My name is Daniel I love chicken and rice. Hiii! My name is
                                Daniel I love chicken and rice.
                            </Text>
                        </div>
                    </Stack>
                </GridItem>
                <GridItem colSpan={2} bg='#0f0e17' padding={10}>
                    <Heading size={['sm', 'md', null, 'lg']} color='#FFFFFE' textAlign='center'>
                        My Favorite Song
                    </Heading>
                    {favoriteSong === null && <Text>Loading...</Text>}
                    {favoriteSong !== null && (
                        <>
                            <Img
                                src={favoriteSong.album.images[1].url}
                                alt={favoriteSong.name}
                                mx='auto' // Add this line to center the image horizontally
                                mt='5'
                                mb='5'
                            />
                            <Heading size={['sm', 'md', null, 'md']} color='#FFFFFE' textAlign='center'>
                                {favoriteSong.name}
                            </Heading>
                        </>
                    )}
                </GridItem>
                <GridItem colSpan={2} bg='#0f0e17' padding={10} textAlign='center'>
                    <Heading size={['sm', 'md', null, 'lg']} color='#FFFFFE'>
                        My Favorite Artist
                    </Heading>
                    {favoriteSong === null && <Text>Loading...</Text>}
                    {favoriteSong !== null && (
                        <>
                            <Img
                                src={favoriteArtist.images[1].url}
                                alt={favoriteArtist.name}
                                mx='auto' // Add this line to center the image horizontally
                                mt='5'
                                mb='5'
                            />
                            <Heading size={['sm', 'md', null, 'md']} color='#FFFFFE' textAlign='center'>
                                {favoriteArtist.name}
                            </Heading>
                        </>
                    )}
                </GridItem>
            </Grid>
        )
    }
}

export default Profile