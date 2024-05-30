import React, { useState } from 'react';
import { Avatar } from '@chakra-ui/react';

function User({ userName, profilePictureUrl }) {
    const [isHovered, setIsHovered] = useState(false);

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'transform 0.3s ease-in-out',
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div
            style={containerStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Avatar
                src={profilePictureUrl}
                boxSize="200px" // Custom size for the avatar
            />
            <b style={{ fontSize: '20px', marginTop: '10px', marginBottom: '5px', color: 'white' }}>{userName}</b>
        </div>
    );
}

export default User;
