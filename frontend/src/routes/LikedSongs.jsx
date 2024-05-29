import React from 'react';
import { useState, useEffect } from "react";
import axios from 'axios';

export const LikedSongs = () => {
    const [songs, setSongs] = useState([]);

    const fetchSongs = async () => {
        try {
            const responses = await axios.get("http://localhost:8000/liked");
            console.log(responses);
        } catch (error) {
            console.log("Error getting the songs: ", error);
        }
    }
    return (
        <>
        <h1>Your Liked Songs</h1>
        </>
    )
}