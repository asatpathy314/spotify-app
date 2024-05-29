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
            const responses = await axios.get("http://localhost:8000/liked");
            console.log(responses.data);
            setSongs(responses.data);
        } catch (error) {
            console.log("Error getting the songs: ", error);
        };
    }

    useEffect(() => {
        fetchSongs()
    }, []);

      const splitArray = (array, size) => {
        const split = [];
        for (let i = 0; i < array.length; i += size) {
            split.push(array.slice(i, i + size));
        }
        return split;
    }

    const split = splitArray(songs, 4);

      return (
        <Container minHeight="100vh" display="grid">
            <Heading color="#FFFFFE">Your Liked Songs</Heading>
            {split.map((chunk, chunkIndex) => (
                <Stack direction='row' spacing={4} key={chunkIndex} marginBottom={4} alignItems="flex-start">
                    {chunk.map((user, userIndex) => (
                        <Card backgroundColor="#0F0E17" width="100%" minWidth="200px" height="20%" minHeight="150px" key={userIndex}>
                            <Box padding="4" textAlign='left'>
                                <Image boxSize='200px' objectFit='cover'
                                    src={user.profilePictureUrl || 'https://via.placeholder.com/150'} alt={user.userName}
                                />
                                <Text color="#FFFFFE" textAlign="center" marginTop="2">{user.userName}</Text>
                            </Box>
                        </Card>
                    ))}
                </Stack>
            ))}
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
