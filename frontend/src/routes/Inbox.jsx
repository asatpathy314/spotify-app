//render the last message in each conversation
//along with the user that you are speaking to and their profile picture
import { useState, useEffect } from "react";
import { Grid, GridItem, Box, Text, Avatar, Stack } from "@chakra-ui/react";
import axios from 'axios';
import '../stylesheets/messages.css';

const Inbox = () => {
    const [conversations, setConversations] = useState([]);
    const { token, setToken, userID, setUserID, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    const currentUserId = "31ow3dazrrvyk7fvsnacgnel4lyu"; // Replace with actual current user ID with sign in info

    useEffect(() => {
        const fetchInbox = async () => {
            try {
                const conversationData = await axios.get("http://localhost:8000/messages?id="+currentUserId) 
                setConversations(conversationData.data);
            } catch (error) {
                console.error("Error fetching Inbox:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInbox();
    }, []);


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Grid
            h='100%'
            templateRows='repeat(3, 1fr)'
            templateColumns='repeat(4, 1fr)'
            gap={4}
            >
                <GridItem colSpan={4} rowSpan={1} bg='papayawhip' />
                <GridItem colSpan={4} rowSpan={2} bg='tomato' />
            </Grid>
        </>
    );
};

export default Inbox;
    