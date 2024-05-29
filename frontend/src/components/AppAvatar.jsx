import { useState } from 'react';
import { Avatar } from '@chakra-ui/react';
import { Box, Wrap, WrapItem } from '@chakra-ui/react';

/**
 * Renders an avatar component based on the provided type.
 * @param {Object} props - The component props.
 * @param {string} props.type - The type of avatar to render. 'profile', 'discover', or 'inbox'.
 * @returns {JSX.Element} - The rendered avatar component.
 */
export const AppAvatar = ( {type, link, size='2xl' } ) => {
    const [discover, setDiscover] = useState(null);
    const [inbox, setInbox] = useState(null);

    if (type === 'profile') {
    return (
        (link ? (
            <>
            <Box mt="10">
                <Wrap spacing="30px">
                    <WrapItem>
                        <Avatar size={size} src='https://bit.ly/broken-link' />
                    </WrapItem>
                </Wrap>
            </Box>
            </>
        ) : (
            <Box mt="10">
                <Wrap spacing="30px">
                    <WrapItem>
                        <Avatar size={size} src={link} />
                    </WrapItem>
                </Wrap>
            </Box>
        ))
    )
    // This logic should be handled in the parent component. The only things that should change here are design for one profile picture.
    } else if (type === 'inbox') { 
        return (
            <div id='inbox-avatar'>
                <Stack direction='row'> 
                    <Avatar src='https://bit.ly/broken-link' />
                    <Avatar src='https://bit.ly/broken-link' />
                    <Avatar src='https://bit.ly/broken-link' />
                    <Avatar src='https://bit.ly/broken-link' />
                    <Avatar src='https://bit.ly/broken-link' />
                </Stack>
            </div>
        )
    } else if (type === 'discover') {
        return (
            <div id='discover-avatar'>
                {/* ? */}
            </div>
        )
    }  
}
