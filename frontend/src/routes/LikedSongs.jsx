import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import { Container, Card, CardHeader, CardBody, CardFooter, Img, Heading, Grid, Stack, Box, Text, GridItem } from "@chakra-ui/react";

export const LikedSongs = () => {
    const [songs, setSongs] = useState([]);
    const { token, setToken, userID, setUserID } = useContext(AuthContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const [forbidden, setForbidden] = useState(null);
    // Fetch the liked songs from the local API
    useEffect(() => {
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
                }
            }
        };
        if (token) {
            fetchSongs();
        } else {
            setForbidden(true); // Make sure that only logged in users can access this page
            window.location.href = '/profile/nosessiontoken';
        }
    }, [token]);
    console.log(songs);

    if (!forbidden && songs && songs.length > 0) {
        return (
            <>
                <Heading mb={5} >Liked Songs</Heading>
                <Grid
                    h="90%"
                    templateRows="repeat(2, 1fr)"
                    templateColumns="repeat(4, 1fr)"
                    gap={4}>
                    {songs.map((song, index) => (
                        <GridItem rowSpan={1} colSpan={1} key={index} display="flex">
                            <Card maxW='sm' bg="#0f0e17" color="#FFFFFE" display="flex" flexDirection="column" height="100%">
                                <CardBody flex="1" display="flex" flexDirection="column">
                                    <Stack mt='6' spacing='3' flex="1">
                                        <Img
                                            src={song.track.album.images[0].url}
                                            alt='Album Cover'
                                            borderRadius='lg'
                                            flex="1"
                                        />
                                        <Heading size='md' textAlign="center">{song.track.name}</Heading>
                                    </Stack>
                                </CardBody>
                            </Card>
                        </GridItem>
                    ))}
                </Grid>
            </>
        );
    } else {
        return null;
    }
};
