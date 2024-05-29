import React from 'react';
import { useContext, useState, useEffect } from "react";
import axios from 'axios';
import { useSearchParams} from "react-router-dom"
import { AuthContext } from "../components/AuthProvider"
import { Container, Card, Image, Heading, Stack, Box, Text } from "@chakra-ui/react";

export const LikedSongs = () => {
    const [songs, setSongs] = useState([]);
    const { token, setToken, userID, setUserID } = useContext(AuthContext)
    const [searchParams, setSearchParams] = useSearchParams()
    const [forbidden, setForbidden] = useState(null)
    
    const fetchSongs = async () => {
        try {
            const responses = await axios.get(`http://localhost:8000/song/liked?spotify_token=${token}`);
            console.log("API: ", responses.data.items);
            setSongs(responses.data.items);
        } catch (error) {
            console.log("Error getting the songs: ", error);
            setSongs([]);
            if (error.response && error.response.status === 403) {
                setForbidden(true);
            };
        };
    }

    useEffect(() => {
        if (token) {
            fetchSongs();
        }
    }, [token]);

      return (
        <Container minHeight="100vh" display="grid">
            <Heading color="#FFFFFE">Your Liked Songs</Heading>
            {forbidden ? (
                <Text color="red.500">You do not have permission to view this content.</Text>
            ) : (
                <Stack direction='row' spacing={4} marginBottom={4} alignItems="flex-start">
                    {songs.map((song, index) => (
                        <Card backgroundColor="#0F0E17" width="100%" minWidth="200px" height="20%" minHeight="150px" key={index}>
                            <Box padding="4" display='flex' flexWrap='wrap'>
                                <Image boxSize='200px' objectFit='cover'
                                    src={song.track.album.images[0].url || 'https://via.placeholder.com/150'} alt={index}
                                />
                                <Text color="#FFFFFE" textAlign="center" marginTop="2">{song.track.name}</Text>
                            </Box>
                        </Card>
                    ))}
                </Stack>
            )}
        </Container>
      )

    /* 

    useEffect(() => {
        if (token===null || userID===null) {
            if (searchParams.get('access_token') && searchParams.get('user_id')) {
                console.log('huge')
                setToken(searchParams.get('access_token'))
                setUserID(searchParams.get('user_id'))
                //fetchSongs();
            } else {
                console.log("hii");
                //setForbidden(true);
                //window.location.replace("/forbidden")
            }
        }
    }, [searchParams, setToken, setUserID, token, userID ])
    if (!forbidden) {
        return (
            <Heading color="#FFFFFE">Your Liked Songs</Heading>
        )
    } else {
        return (
            <Heading color="#FFFFFE">Your Liked Not Songs</Heading>
        )
    }; */
}
