import React, { useState, useEffect } from 'react';

function User({ userName, profilePictureUrl }) {
    const [isHovered, setIsHovered] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState(getRandomColor());

    useEffect(() => {
        setBackgroundColor(getRandomColor());
    }, []);

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left', // Align both image and text horizontally
        transition: 'transform 0.3s ease-in-out', // Adding transition for smooth effect
        transform: isHovered ? 'scale(1.1)' : 'scale(1)'
    };

    const imgStyle = {
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        objectFit: 'cover',
    };

    const noImgStyle = {
        ...imgStyle,
        backgroundColor: backgroundColor // Use the randomized color here
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
            {profilePictureUrl ? (
                <img src={profilePictureUrl} alt={`${userName}'s profile`} style={imgStyle} />
            ) : (
                <div style={noImgStyle}></div>
            )}
            <b style={{ fontSize: '22px', marginTop: '10px', marginBottom: '5px', color: 'white' }}>{userName}</b>
            <p style={{ margin: 0 , color: 'white'}}>Profile</p>
        </div>
    );
}

export default User;

function getRandomColor() {
    const colors = ['#F1A819', '#E53170'];
    return colors[Math.floor(Math.random() * colors.length)];
}
