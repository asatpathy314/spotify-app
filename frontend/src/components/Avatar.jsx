import { useState} from 'react';
import { Avatar } from '@chakra-ui/react';
import { Box, Wrap, WrapItem } from '@chakra-ui/react';

/**
 * Renders an avatar component based on the provided type.
 * @param {Object} props - The component props.
 * @param {string} props.type - The type of avatar to render. 'profile', 'discover', or 'inbox'.
 * @returns {JSX.Element} - The rendered avatar component.
 */
export const AppAvatar = ( {type} ) => {
    const [profile, setProfile] = useState(null);
    const [discover, setDiscover] = useState(null);
    const [inbox, setInbox] = useState(null);

    if (type === 'profile') {
    return (
        (profile ? (
            <>
            <Box mt="10">
                <Wrap justify="center" spacing="30px">
                    <WrapItem>
                        <Avatar size='2xl' src='https://bit.ly/broken-link' />
                    </WrapItem>
                </Wrap>
            </Box>
            </>
        ) : (
            <Box mt="10">
                <Wrap justify="center" spacing="30px">
                    <WrapItem>
                        <Avatar src='https://bit.ly/broken-link' />
                    </WrapItem>
                </Wrap>
            </Box>
        ))
    )
    } else if (type === 'discover') {
        return (
            <div>Insert code here</div>
        )
    } // Continue for every avatar component 
}
