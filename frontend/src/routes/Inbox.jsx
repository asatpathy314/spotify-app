import { useState, useEffect, useContext } from "react";
import { Grid, GridItem, Box, Text, Avatar, Stack, Flex, Heading, Link } from "@chakra-ui/react";
import { AuthContext } from "../components/AuthProvider";
import ConversationDisplay from "../components/ConversationDisplay"; // Individual conversation display component.
import axios from 'axios';

const Inbox = () => {
    const [conversations, setConversations] = useState([]);
    const [noConversations, setNoConversations] = useState(false);
    const { token, setToken, userID, setUserID, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [forbidden, setForbidden] = useState(null);

    const getCorrectUserId = (id1, id2) => {
        if (id1 === userID) {
            return id2;
        } else {
            return id1;
        }
    };

    useEffect(() => {
        if (!token || !userID) {
            window.location.href = "/profile/nosessiontoken";
            setForbidden(true);
            return;
        }
        const fetchInbox = async () => {
            try {
                const conversationData = await axios.get("http://localhost:8000/messages?id=" + userID);
                if (conversationData.error && conversationData.error === "No conversations found") {
                    setNoConversations(true);
                }
                setConversations(
                    conversationData.data.sort((a, b) => {
                        const lastMessageA = a.messages[a.messages.length - 1];
                        const lastMessageB = b.messages[b.messages.length - 1];
                        return lastMessageB.timestamp._seconds - lastMessageA.timestamp._seconds;
                    })
                );
            } catch (error) {
                console.error("Error fetching Inbox:", error);
            } finally {
                setLoading(false);
            }
        };
        if (!forbidden) {
            fetchInbox();
        }
    }, [userID, token]);
    // Sort conversations by the timestamp of the last message in descending order

    const sortedConversations = conversations

    if (loading) {
        return (
            <Flex height="100%" alignItems="center" justifyContent="center">
                <Heading>
                    Loading...
                </Heading>
            </Flex>
        );
    } else if (conversations && !noConversations) {
        return (
            <>
                <Stack direction="column" width="100%">
                    {sortedConversations.map((conversation, index) => {
                        const correctUserId = getCorrectUserId(conversation.user1._path.segments[1].trim(), conversation.user2._path.segments[1].trim());
                        return <ConversationDisplay userID={correctUserId} key={index} keyValue={index} conversation={conversation} />;
                    })}
                </Stack>
            </>
        );
    } else if (noConversations) {
        return (
            <Heading size='xl' textAlign='center' margin='auto'>
                Start a conversation on the <Link href='/discover' color="#ff8906" textDecoration={"underline"}>Discover</Link> page!
            </Heading>
        );
    }
};

export default Inbox;
