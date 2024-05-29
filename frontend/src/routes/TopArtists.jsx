import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import axios from "axios";
import DataGrid from "../components/Datagrid";
import TimeButton from "../components/TimeButton";
import { Box, Heading } from "@chakra-ui/react";

const TopArtists = () => {
    const { token, setToken, userID, setUserID, refreshToken } = useContext(AuthContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const [topArtists, setTopArtists] = useState([]);
    const [forbidden, setForbidden] = useState(false);
    const [timeframe, setTimeframe] = useState('long_term');

    useEffect(() => {
        const fetchData = async (accessToken) => {
            try {
                const response = await axios.get(`http://localhost:8000/artist`, {
                    params: {
                        spotify_token: accessToken,
                        num_artists: 10,
                        timeframe: timeframe
                    }
                });
                if (response.status === 200) {
                    const formattedArtists = response.data.items.map(item => ({
                        artist: item.name
                    }));
                    setTopArtists(formattedArtists);
                } else {
                    setTopArtists([{ error: 'An Error Occurred. Please try again later.' }]);
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    try {
                        const newToken = await refreshAccessToken();
                        if (newToken) {
                            setToken(newToken);
                            fetchData(newToken);
                        } else {
                            setForbidden(true);
                            window.location.replace("/forbidden");
                        }
                    } catch (refreshError) {
                        console.error("Error refreshing token:", refreshError);
                        setForbidden(true);
                        window.location.replace("/forbidden");
                    }
                } else {
                    console.error("Error fetching top artists:", error);
                }
            }
        };

        if (token === null || userID === null) {
            if (searchParams.get('access_token') && searchParams.get('user_id')) {
                setToken(searchParams.get('access_token'));
                setUserID(searchParams.get('user_id'));
                fetchData(searchParams.get('access_token'));
            } else {
                setForbidden(true);
                window.location.replace("/forbidden");
            }
        } else {
            fetchData(token);
        }
    }, [token, userID, searchParams, setToken, setUserID, timeframe]);

    const refreshAccessToken = async () => {
        try {
            const response = await axios.post('http://localhost:8000/refresh_token', { refresh_token: refreshToken });
            if (response.status === 200) {
                return response.data.access_token;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error refreshing access token:", error);
            return null;
        }
    };

    if (forbidden) {
        return null;
    }

    return (
        <Box p={4}>
            <Heading as="h1" size="xl" mb={4}>Top Artists</Heading>
            <TimeButton currentTimeframe={timeframe} setTimeframe={setTimeframe} />
            <DataGrid data={topArtists} type="artists" />
        </Box>
    );
};

export default TopArtists;
