import React, { useState, useEffect } from 'react';
import axios from "axios";

import {Box, Link} from '@chakra-ui/react';
import User from '../components/User';
import '../stylesheets/discover.css';

function Discover() {
    const [profiles, setProfiles] = useState([]);
    useEffect(() => {
        const getProfiles = async () => {
            try {
                const response = await axios.get('http://localhost:8000/user/all');
                console.log('API Response:', response.data);
                if (Array.isArray(response.data)) {
                    setProfiles(response.data);
                }
            } catch (error) {
                console.error('Error fetching profiles:', error);
                setProfiles([]);
            }
        };

        getProfiles();
    }, []);

    return (
        <>
        <div style={{ padding: '20px'}}>
            <div>
                <p style={{ fontSize: '50px',  color: 'white', fontWeight: 'bold' }}>Discover</p>
            </div>

            <div >
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 10}}>
                {profiles.map((profile, index) => (
                    <Link key={index} href={`/profile/${profile.id}`}>
                        <div >
                            <User userName={profile.name} profilePictureUrl={profile.profile} />
                        </div>
                    </Link>
                ))}
                </Box>
            </div>
        </div>
        </>
    )
}

export default Discover;