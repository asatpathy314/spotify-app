import { Card, Image, Stack, CardBody, Heading, CardFooter, Text, Button, Avatar, Link, Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ConversationDisplay = ({ userID, keyValue, conversation }) => {
    const [userData, setUserData] = useState([]);
    const [latestMessage, setLatestMessage] = useState("");

    useEffect(() => {
        axios.get('http://localhost:8000/user?id=' + userID)
            .then((res) => setUserData(res.data))
            .catch((err) => console.error(err));
        setLatestMessage(conversation.messages[conversation.messages.length - 1]);
    }, [userID, conversation]);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
        return date.toLocaleString();
    };

    return (
        <Link key={1000 - keyValue} href={`/messages/${conversation.id}`}>
            <Card
                direction='row'
                overflow='hidden'
                bg='#0f0e17'
                borderRadius={100}
                position="relative"
                maxWidth="100%" // Ensure the card does not exceed the viewport width
                flexWrap="wrap" // Allow content to wrap within the card
                p={{ base: 2, md: 4 }} // Responsive padding
                m={{ base: 2, md: 4 }} // Responsive margin
            >
                <Avatar src={userData.profile} size={'2xl'} margin='5' />
                <CardBody color="white" p={6}>
                    <Stack>
                        <Stack direction={{ base: "column", md: "row" }} justifyContent="space-between" alignItems={{ base: "flex-start", md: "center" }}>
                            <Heading>
                                {userData.name}
                            </Heading>
                            <Text>{latestMessage && formatDate(latestMessage.timestamp._seconds)}</Text>
                        </Stack>
                        <Text>
                            {latestMessage && latestMessage.user._path.segments[1].trim() !== userID ? "You: " : ""}{latestMessage.text}
                        </Text>
                    </Stack>
                </CardBody>
            </Card>
        </Link>
    );
};

export default ConversationDisplay;
