//render the last message in each conversation
//along with the user that you are speaking to and their profile picture
import React from "react";
import { useState, useEffect} from "react";


const Inbox = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUserId = "5qBIt75cDvfOV5lVPNM9"; // Replace with actual current user ID with sign in info

    useEffect(() => {
        const fetchInbox = async () => {
          try {
            const response = await axios.get("http://localhost:8000/messages", {
            params: { userId: currentUserId }, // Send userId as query parameter
            });
            console.log("Fetched conversations:", response.data.conversations);
            setForums(response.data.conversations);
          } catch (error) {
            console.error("Error fetching Inbox:", error);
          } finally {
            setLoading(false);
          }
        };

            fetchInbox();
    }, []);

    const getLastMessage = (messages) => {
        if (!messages.length) return null;
        return messages.reduce((latest, message) => {
          return new Date(message.timestamp) > new Date(latest.timestamp) ? message : latest;
        });
    };

    const getCommunicatingUser = (conversation) => {
        return conversation.user1 === currentUserId ? conversation.user2 : conversation.user1;
    };
  
    const fetchUserProfile = async (userId) => {
        try {
          const response = await axios.get(`http://localhost:8000/users/${userId}`);
          return response.data.user;
        } catch (error) {
          console.error("Error fetching user profile:", error);
          return null;
        }
    };

    if(loading){
        return(
            <div>Loading...</div>
        );
    }

    return (
        <>
        <p>This is the Inbox page</p>
        {conversations.map((conversation) => {
            const communicatingUserId = getCommunicatingUser(conversation);
            const lastMessage = getLastMessage(conversation.messages);
                    
            const [communicatingUser, setCommunicatingUser] = useState(null);
                    
            useEffect(() => {
                const fetchCommunicatingUser = async () => {
                const userProfile = await fetchUserProfile(communicatingUserId);
                    setCommunicatingUser(userProfile);
                };
                    
                fetchCommunicatingUser();
            }, [communicatingUserId]);
                    
            if (!communicatingUser || !lastMessage) return null;
                    
            return (
                <div key={conversation.id} className="conversation">
                <div className="user-info">
                    <img
                        src={communicatingUser.profilePicture}
                        alt={`${communicatingUser.name}'s profile`}
                    />
                        <p>{communicatingUser.name}</p>
                        </div>
                    <div className="last-message">
                    <p>
                    {lastMessage.senderId === currentUserId ? "You: " : `${communicatingUser.name}: `}
                    {lastMessage.text}
                    </p>
                    </div>
            </div>
            );
        })}
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
    