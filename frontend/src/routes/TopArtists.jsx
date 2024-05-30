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
    const [topArtistsLongTerm, setTopArtistsLongTerm] = useState([]);
    const [topArtistsMediumTerm, setTopArtistsMediumTerm] = useState([]);
    const [topArtistsShortTerm, setTopArtistsShortTerm] = useState([]);
    const [forbidden, setForbidden] = useState(false);
    const [timeframe, setTimeframe] = useState('short_term');

    const returnTopArtists = (timeframe) => {
        if (timeframe === 'long_term') {
            return topArtistsLongTerm;
        } else if (timeframe === 'medium_term') {
            return topArtistsMediumTerm;
        } else if (timeframe === 'short_term') {
            return topArtistsShortTerm;
        }
    }

    useEffect(() => {
        if (!token || !userID) {
            if (searchParams.get('access_token') && searchParams.get('user_id')) {
                setToken(searchParams.get('access_token'));
                setUserID(searchParams.get('user_id'));
            }  else {
                setForbidden(true); // Make sure that only logged in users can access this page
                window.location.href = '/profile/nosessiontoken';
            }
        }

        const allTimeFrames = ['short_term', 'medium_term', 'long_term'];
        const fetchData = async (timeframe) => {
            try {
                const response = await axios.get(`http://localhost:8000/artist`, {
                    params: {
                        spotify_token: token,
                        num_artists: 10,
                        timeframe: timeframe
                    }
                });
                if (response.status === 200) {
                    const formattedArtists = response.data.items.map(item => ({
                        artist: item.name
                    }));
                    if (timeframe === 'long_term') {
                        setTopArtistsLongTerm(formattedArtists);
                    } else if (timeframe === 'medium_term') {
                        setTopArtistsMediumTerm(formattedArtists);
                    } else if (timeframe === 'short_term') {
                        setTopArtistsShortTerm(formattedArtists);
                    }
                } else {
                    console.error('Error setting artists.');
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

        if (token) {
            (async () => {
                for (const timeFrame of allTimeFrames) {
                    await fetchData(timeFrame);
                }
            })();
        }
    }, [token, userID, searchParams, setToken, setUserID]);

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

    if (!forbidden) {
        return (
            <div>
                <h1>Top Songs</h1>
                <TimeButton currentTimeframe={timeframe} setTimeframe={setTimeframe} />
                <DataGrid data={returnTopArtists(timeframe)} type="artists" />
            </div>
        );
    } else {
        return null;
    }
};

export default TopArtists;
