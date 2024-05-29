import React, { useState, useEffect } from 'react';


import Box from '@mui/material/Box';
import User from '../components/User';
//import { Link } from "react-router-dom";
import '../stylesheets/discover.css';

function Discover() {
    const [profiles, setProfiles] = useState([]);

    const dummyData = [
        {
          userName: 'john_doe',
          profilePictureUrl: 'https://w0.peakpx.com/wallpaper/357/667/HD-wallpaper-ghost-profile-thumbnail.jpg'
        },
        {
          userName: 'jane_smith',
          profilePictureUrl: null
        },
        {
          userName: 'alice_jones',
          profilePictureUrl: 'https://lh4.googleusercontent.com/proxy/XZjBQs671YZjpKSHu4nOdgKygc5oteGGQ4nznFtymv2Vr1t6lHDdhqPe-Pk-8IJe7pW4AhhKOTWRVt_b6G4qHF92n7Z1QCMVCNXCP2yayQrC-6Fichft'
        },
        {
          userName: 'bob_brown',
          profilePictureUrl: null
        },
        {
          userName: 'charlie_black',
          profilePictureUrl: 'https://pics.craiyon.com/2023-09-14/652e821477ea49fbaebbd929bb176bd9.webp'
        },
        {
          userName: 'david_white',
          profilePictureUrl: null
        },
        {
          userName: 'emily_green',
          profilePictureUrl: 'https://www.thesprucepets.com/thmb/QEM2TRph1ibXY_QtRY0_JOiNEmo=/1080x0/filters:no_upscale():strip_icc()/30592721_1202575869845701_6168113550100267008_n-5b0df5208023b90036f8f456.jpg'
        },
        {
          userName: 'frank_blue',
          profilePictureUrl: null
        }
      ];

    useEffect(() => {
        setProfiles(dummyData);
        // const getProfiles = async () => {
        //     try {
        //         // get all posts
        //         const response = await axios.get('http://localhost:5001/posts');
        //         setProfiles(response.data);
        //     } catch (error) {
        //         console.error('Error fetching profiles:', error);
        //     }
        // }
        // getProfiles();
    }, []);

    return (
        
        <>
        <div stytle={{ padding: '20px'}}>
            <div>
                <h1>Discover</h1>
            </div>

            <div >
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2}}>
                {profiles.map((profile, index) => (
                    <div key={index} >
                        <User userName={profile.userName} profilePictureUrl={profile.profilePictureUrl} />
                    </div>
                ))}
                </Box>
            </div>
        </div>
        </>
    )
}

export default Discover;