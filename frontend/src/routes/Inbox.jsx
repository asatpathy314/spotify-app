//render the last message in each conversation
//along with the user that you are speaking to and their profile picture
import { useState, useEffect, useContext } from "react";
import { Grid, GridItem, Box, Text, Avatar, Stack, Heading, Link } from "@chakra-ui/react";
import { AuthContext } from "../components/AuthProvider";
import Conversation from "../components/Conversation"; // Individual conversation display component.
import axios from 'axios';

const Inbox = () => {
    const [conversations, setConversations] = useState([]);
    const [noConversations, setNoConversations] = useState(false);
    const { token, setToken, userID, setUserID, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    const getCorrectUserId = (id1, id2) => {
        if (id1 === userID) {
            return id2;
        } else {
            return id1
        }
    }
    useEffect(() => {
        const fetchInbox = async () => {
            try {
                const conversationData = await axios.get("http://localhost:8000/messages?id="+userID) 
                if (conversationData.error && conversationData.error === "No conversations found") {
                    setNoConversations(true);
                }
                setConversations(conversationData.data);
            } catch (error) {
                console.error("Error fetching Inbox:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInbox();
    }, [userID]);
    console.log(conversations)

    if (loading) {
        return <div>Loading...</div>;
    } else if (conversations && !noConversations) {
        return (
            <>
                <Stack direction="column">
                    {conversations.map((conversation, index) => {
                        const correctUserId = getCorrectUserId(conversation.user1._path.segments[1].trim(), conversation.user2._path.segments[1].trim());
                        return <Conversation userID={correctUserId} key={index} keyValue={index} conversation={conversation}/>;
                    })}
                </Stack>
            </>
        );
    } else if ( noConversations ) {
        return (
            <Heading size='xl' textAlign='center' margin='auto'>
                Start a conversation on the <Link href='/discover' color="#ff8906" textDecoration={"underline"}>Discover</Link> page!
            </Heading>        
          )
    }
};

export default Inbox;
    