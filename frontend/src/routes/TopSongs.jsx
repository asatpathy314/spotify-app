import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import axios from "axios";
import DataGrid from "../components/Datagrid"; // Correct import statement

const TopSongs = () => {
    const { token, setToken, userID, setUserID } = useContext(AuthContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const [topSongs, setTopSongs] = useState([]);
    const [forbidden, setForbidden] = useState(false);

    useEffect(() => {
        if (token === null || userID === null) {
            if (searchParams.get('access_token') && searchParams.get('user_id')) {
                setToken(searchParams.get('access_token'));
                setUserID(searchParams.get('user_id'));
            } else {
                setForbidden(true);
                window.location.replace("/forbidden");
            }
        }

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/song`, {
                    params: {
                        spotify_token: token,
                        num_songs: 10,
                        timeframe: 'long_term'
                    }
                });
                if (response.status === 200) {
                    const formattedSongs = response.data.items.map(item => ({
                        song: item.name,
                        artist: item.artists[0].name,
                        album: item.album.name,
                        length: new Date(item.duration_ms).toISOString().substr(14, 5) // Format duration
                    }));
                    setTopSongs(formattedSongs);
                } else {
                    setTopSongs([{ error: 'An Error Occurred. Please try again later.' }]);
                }
            } catch (error) {
                console.error("Error fetching top songs:", error);
                setTopSongs([{ error: 'An Error Occurred. Please try again later.' }]);
            }
        };

        if (token) {
            fetchData();
        }
    }, [token, userID, searchParams, setToken, setUserID]);

    if (forbidden) {
        console.log("mistake");
        return null;
    }

    return (
        <div>
            <h1>Top Songs</h1>
            <DataGrid data={topSongs} type="songs" />
        </div>
    );
};

export default TopSongs;
