import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider"; 
import { Stack, Heading } from "@chakra-ui/react";
import axios from "axios";
import DataGrid from "../components/Datagrid";
import TimeButton from "../components/TimeButton";

const TopSongs = () => {
    const { token, setToken, userID, setUserID } = useContext(AuthContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const [topSongsLongTerm, setTopSongsLongTerm] = useState([]);
    const [topSongsMediumTerm, setTopSongsMediumTerm] = useState([]);
    const [topSongsShortTerm, setTopSongsShortTerm] = useState([]);
    const [forbidden, setForbidden] = useState(false);
    const [timeframe, setTimeframe] = useState('short_term');
    
    const returnTopSongs = (timeframe) => {
        if (timeframe === 'long_term') {
            return topSongsLongTerm;
        } else if (timeframe === 'medium_term') {
            return topSongsMediumTerm;
        } else if (timeframe === 'short_term') {
            return topSongsShortTerm;
        }    
    }

    useEffect(() => {
        if (!token || !userID) {
            if (searchParams.get('access_token') && searchParams.get('user_id')) {
                setToken(searchParams.get('access_token'));
                setUserID(searchParams.get('user_id'));
            } else {
                setForbidden(true); // Make sure that only logged in users can access this page
                window.location.href = '/profile/nosessiontoken';
            }
        }

        const allTimeFrames = ['short_term', 'medium_term', 'long_term'];
        const fetchData = async (timeframe) => {
            try {
                const response = await axios.get(`http://localhost:8000/song`, {
                    params: {
                        spotify_token: token,
                        num_songs: 10,
                        timeframe: timeframe
                    }
                });
                if (response.status === 200) {
                    const formattedSongs = response.data.items.map(item => ({
                        song: item.name,
                        artist: item.artists[0].name,
                        album: item.album.name,
                        length: new Date(item.duration_ms).toISOString().substr(14, 5)
                    }));
                    if (timeframe === 'long_term') {
                        setTopSongsLongTerm(formattedSongs);
                    } else if (timeframe === 'medium_term') {
                        setTopSongsMediumTerm(formattedSongs);
                    } else if (timeframe === 'short_term') {
                        setTopSongsShortTerm(formattedSongs);
                    }
                } else {
                    console.error('Error setting songs.');
                }
            } catch (error) {
                console.error("Error fetching top songs:", error);
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

    if (!forbidden) {
        return (
            <Stack direction="column" gap={5}>
                    <Stack direction = "row" display='flex'>
                        <Heading>Top Songs</Heading>
                        <TimeButton currentTimeframe={timeframe} setTimeframe={setTimeframe} />
                    </Stack>
                <DataGrid data={returnTopSongs(timeframe)} type="songs" />
            </Stack>
        );
    } else {
        return null;
    }
};

export default TopSongs;
