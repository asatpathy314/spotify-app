//render the last message in each conversation
//along with the user that you are speaking to and their profile picture
import React, { useState, useEffect } from "react";
import axios from 'axios';

const Inbox = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUserId = "31ow3dazrrvyk7fvsnacgnel4lyu"; // Replace with actual current user ID with sign in info

    useEffect(() => {
        const fetchInbox = async () => {
            try {
                const response = axios.get("http://localhost:8000/messages", {
                    params: { userId: currentUserId },
                })  .then(async (res) => {

                    console.log("Fetched conversation references:", response.data);
                    const conversationReferences = response.data;
        
                    // Fetch conversations using conversation references
                    const conversationRequests = conversationReferences.map(async () => {
                        const conversationResponse = await axios.get(`http://localhost:8000/conversation/${reference.id}`);
                        return conversationResponse.data;
                    });
        
                    // Wait for all conversation requests to complete
                    const conversationsData = await conversationRequests;
        
                    console.log("Fetched conversations:", conversationsData);
                    setConversations(conversationsData);
                })

            } catch (error) {
                console.error("Error fetching Inbox:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchInbox();
    }, []);
    
    const getLastMessage = (messages) => {
        if (!Array.isArray(messages) || messages.length === 0) 
        {
            console.log("get last message is null");
            return null;
        }
        return messages.reduce((latest, message) => {
            return new Date(message.timestamp) > new Date(latest.timestamp) ? message : latest;
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    console.log("I am trying to render the inbox page");
    return (
        <>
            <p>This is the Inbox page</p>
            {conversations.map((conversation) => {
                const communicatingUserId = conversation.user1 === currentUserId ? conversation.user2 : conversation.user1;
                const lastMessage = getLastMessage(conversation.messages);

                if (!communicatingUserId || !lastMessage) return null;

                return (
                    <div key={conversation.id} className="conversation">
                        <div className="user-info">
                            <UserProfile userId={communicatingUserId} />
                        </div>
                        <div className="last-message">
                            <LastMessage lastMessage={lastMessage} communicatingUserId={communicatingUserId} currentUserId={currentUserId} />
                        </div>
                    </div>
                );
            })}
        </>
    );
};

const UserProfile = ({ userId }) => {
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/users/${userId}`);
                setUserProfile(response.data);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUserProfile();
    }, [userId]);

    if (!userProfile) return null;

    return (
        <>
            <img src={userProfile.profilePicture} alt={`${userProfile.name}'s profile`} />
            <p>{userProfile.name}</p>
        </>
    );
};

const LastMessage = ({ lastMessage, communicatingUserId, currentUserId }) => {
    const senderId = lastMessage.user; // Assuming 'user' field contains the sender's ID

    return (
        <p>
            {senderId === currentUserId ? "You: " : `${communicatingUserId === senderId ? "Them" : "You"}: `}
            {lastMessage.text}
        </p>
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
    