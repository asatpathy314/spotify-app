import { useContext, useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import { Button, Text, Stack, Box } from "@chakra-ui/react";
import axios from "axios";

// Profile page and useContext setup. Users are redirected here after the login.
const Conversation = () => {
  const { token, setToken, userID, setUserID } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversationData, setConversationData] = useState(null); // Data for the conversation
  const [forbidden, setForbidden] = useState(null); // Determines if the user has permission to view the page
  const [error, setError] = useState(null); // Error handling
  const { id } = useParams();

  useEffect(() => {
    // Check if the user is coming from the login page
    if (!token || !userID) {
      setForbidden(true);
      window.location.href = "/profile/nosessiontoken";
    } else if (id) {
      axios
        .get("http://localhost:8000/messages/conversation?id=" + id)
        .then((res) => {
          if (res.status > 200) {
            setError(true);
          } else {
            setConversationData(res.data);
          }
        })
        .catch((err) => {
          console.error("Error fetching conversation:", err);
          setError(true);
        });
    }
  }, [token, userID, id]);

  if (conversationData) {
    return (
      <Stack gap={3}>
        {conversationData.messages.map((message, index) => {
        const userMessageID = message.user._path.segments[1].trim();
        const isUser = userMessageID === userID;

          return (
            <Box key={index} width="100%" display='flex' >
                <Box bg={isUser ? '#f25f4c' : '#a7a9be'} ml={isUser ? 'auto' : 0} maxWidth = "40%" p={3}>
                    <Text color="#FFFFFE" fontSize={['lg', 'xl', '2xl', '3xl']} textAlign={isUser ? 'right' : 'left'}>{"message.textmessage.text"}</Text>
                </Box>
            </Box>
          );
        })}
      </Stack>
    );
  } else if (error) {
    return <h1>Error fetching conversation</h1>;
  }
  return (
    <h1>Loading</h1>
  ); // Return null or a loading indicator while data is being fetched
};

export default Conversation;
