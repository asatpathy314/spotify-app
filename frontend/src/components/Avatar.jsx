import React from "react";
import { useState} from 'react';
import { Avatar } from '@chakra-ui/react';
import { Box, Text, ChakraProvider, Wrap, WrapItem } from '@chakra-ui/react';

export const AppAvatar = () => {
    const [profile, setProfile] = useState(null);
    const [discover, setDiscover] = useState(null);
    const [inbox, setInbox] = useState(null);

    return (
        <ChakraProvider>
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
        </ChakraProvider>
    )
}