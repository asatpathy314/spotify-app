//render the last message in each conversation
//along with the user that you are speaking to and their profile picture
import { useState, useEffect } from "react";
import { Grid, GridItem, Box, Text, Avatar, Stack, Card, CardHeader, CardBody, Heading, Button, Img} from "@chakra-ui/react";
import axios from 'axios';
import '../stylesheets/messages.css';

const Inbox = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUserId = "31ow3dazrrvyk7fvsnacgnel4lyu"; // Replace with actual current user ID with sign in info

    useEffect(() => {
        const fetchInbox = async () => {
            try {
                axios.get("http://localhost:8000/messages", {
                    params: { userId: currentUserId },
                })  .then(async (res) => {

                    console.log("Fetched conversation references:", res.data);
                    const conversationReferences = res.data;
                    console.log('here', conversationReferences.conversations)
        
                    //Fetch conversations using conversation references
                    await (conversationReferences.conversations).map(async (item, index) => {
                        const conversationResponse = await axios.get(`http://localhost:8000/messages/conversation`, {
                            params: { conversationId: convoId},
                        });
                        return conversationResponse.data;
                    })
                    setConversations(conversationReferences.conversations);

                })

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

                <GridItem colSpan={4} rowSpan={1} bg='papayawhip'>
                    <div className = "buddies">Send a Message</div>
                    <Card flex="1" display="flex" flexDirection="column">

                    </Card>
                </GridItem>


                <GridItem colSpan={4} rowSpan={2} bg='tomato'>
                    <div className="MyConversations">My conversations</div>
                    <Stack mt='6' spacing='3' flex="1">
                        <Img className = "friendImage"
                            src="https://pics.craiyon.com/2023-05-31/220e4c73f6674d46a84840ebde9f9bc8.webp"
                            alt='FriendPic'
                        />
                    </Stack>
                </GridItem>
            </Grid>
        </>
    );
};

export default Inbox;



//for every conversation fetched

        //identify its ID

            //check the user1 and user2 field in the conversation document (one is me and one is the message recepient)
                //the one that is not me is the user id with whom i am talking, they are set to communicatingWith
            //go thru users collection to find the user's profile who I am talking to 
            //display the person I am talking to's profile picture

            //go thru the messages array (also part of a conversation document, an array of maps)
                    //for each message find the message with the most recent time stamp 
                        //set that to recentMess
                    //find user who sent it
                        //set that to recentMessSender

                    //if recentMesSender is me put "you" before displaying the message
                    //if its them put "them"
    