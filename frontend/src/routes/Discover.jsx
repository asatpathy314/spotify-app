import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Box, Link, SimpleGrid } from '@chakra-ui/react';
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
            <div style={{ padding: '20px' }}>
                <div>
                    <p style={{ fontSize: '50px', color: 'white', fontWeight: 'bold' }}>Discover</p>
                </div>

                <div>
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={3} textAlign={'center'}>
                        {profiles.map((profile, index) => (
                            <Link key={index} href={`/profile/${profile.id}`}>
                                <Box>
                                    <User userName={profile.name} profilePictureUrl={profile.profile} />
                                </Box>
                            </Link>
                        ))}
                    </SimpleGrid>
                </div>
            </div>
        </>
    );
}

export default Discover;
