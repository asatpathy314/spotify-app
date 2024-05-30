//component to render horizontal list of users to message

import { Card, Image, Stack, CardBody, Heading, CardFooter, Text, Button, Avatar, Link } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Conversation = ( { userID, keyValue, conversation } ) => {
    const [userData, setUserData] = useState([]);
    const [latestMessage, setLatestMessage] = useState("");
    
    useEffect(() => {
        axios.get('http://localhost:8000/user?id='+userID)
            .then((res) => setUserData(res.data))
            .catch((err) => console.error(err))
        setLatestMessage(conversation.messages[conversation.messages.length-1])
    }, [userID, conversation]);


return (
    <Link key={1000-keyValue} href={`/messages/${conversation.id}`}>
        <Card
            direction='row'
            overflow='hidden'
            bg='#0f0e17'
            borderRadius={100}
            >   
                <Avatar src={userData.profile} size={'2xl'} margin='5'/>
                <CardBody color = "white">
                    <Stack>
                        <Heading>
                            {userData.name}
                        </Heading>
                        <Text>
                            {latestMessage && latestMessage.user._path.segments[1].trim() !== userID ? "You: " : ""}{latestMessage.text} 
                        </Text>
                    </Stack>
                </CardBody>
        </Card>
    </Link>
    )
}

export default Conversation;