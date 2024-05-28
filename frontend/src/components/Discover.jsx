import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Profile from './Profile';
import Box from '@mui/material/Box';

function Discover() {
    const [profiles, setProfiles] = useState([]);
    return (
        <>
        <div>
            <h1>Discover</h1>
        </div>

        <div>
            <Box sx={{ display: 'flex', gap: 2, border: 1}}>
                {profiles.map((profile, index) => (
                    <div key={index}>
                        <Profile />
                    </div>
                ))}
            </Box>
        </div>

        </>
    )
}

export default Discover;