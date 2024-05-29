import React from 'react';
import { useContext, useState, useEffect } from "react";
import axios from 'axios';
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import { Container, Card, CardHeader, CardBody, CardFooter, Img, Heading, Grid, Stack, Box, Text, GridItem } from "@chakra-ui/react";

export const LikedSongs = () => {
    const [songs, setSongs] = useState([]);
    const { token, setToken, userID, setUserID } = useContext(AuthContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const [forbidden, setForbidden] = useState(null);

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
            setForbidden(true);
            window.location.href('/profile/nosessiontoken');
        }
    }, [token]);
    console.log(songs);

    const bundleSongs = (array, size) => {
        const bundled = [];
        for (let i = 0; i < array.length; i += size) {
            bundled.push(array.slice(i, i + size));
        }
        return bundled;
    };

    if (!forbidden) {
        return (
            <>
                <Grid
                    h="90%"
                    templateRows="repeat(2, 1fr)"
                    templateColumns="repeat(4, 1fr)"
                    gap={4}>
                    {songs.map((song, index) => (
                        <GridItem rowSpan={1} colSpan={1} key={index}>
                            <Card maxW='sm' bg="#0f0e17" color="#FFFFFE">
                            <CardBody>
                                <Img
                                src={song.track.album.images[0].url}
                                alt='Album Cover'
                                borderRadius='lg'
                                />
                                <Stack mt='6' spacing='3'>
                                <Heading size='md'>{song.track.name}</Heading>
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
