import { useContext, useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import {
  Button,
  Text,
  Stack,
  Box,
  Input,
  FormControl,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { IoIosSend } from "react-icons/io";
import axios from "axios";

// Profile page and useContext setup. Users are redirected here after the login.
const Conversation = () => {
  const { token, setToken, userID, setUserID } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [messageData, setMessageData] = useState(null); // Data for the conversation
  const [forbidden, setForbidden] = useState(null); // Determines if the user has permission to view the page
  const [error, setError] = useState(null); // Error handling
  const { id } = useParams();
  const [message, setMessage] = useState(""); // Local message state

  useEffect(() => {
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
            setMessageData(res.data.messages);
          }
        })
        .catch((err) => {
          console.error("Error fetching conversation:", err);
          setError(true);
        });
    }
  }, [token, userID, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Fetch the document reference for the user
      const res = await axios.get(
        `http://localhost:8000/user/getDocRef?id=${userID}`
      );
      if (res.status === 200) {
        const newMessageDocRef = res.data;
        console.log(newMessageDocRef);

        // Update the local state with the new message
        const newMessage = {
          text: message,
          user: newMessageDocRef,
          timestamp: new Date().toISOString(),
        };
        setMessageData([...messageData, newMessage]);

        // Clear the input field after submission
        setMessage("");

        // Send the new message to the backend
        await axios.post(
          `http://localhost:8000/messages/updateConversation?id=${id}&userID=${userID}`,
          { messages: [newMessage] }
        );
        console.log("Message submitted:", newMessage);
      }
    } catch (error) {
      console.error("Error submitting message:", error);
    }
  };

  if (messageData) {
    return (
      <Stack gap={3}>
        {messageData.map((message, index) => {
          const userMessageID = message.user._path.segments[1].trim();
          const isUser = userMessageID === userID;

          return (
            <Box key={index} width="100%" display="flex">
              <Box
                bg={isUser ? "#f25f4c" : "#a7a9be"}
                ml={isUser ? "auto" : 0}
                display="inline-block"
                p={4}
                borderRadius={40}
                whiteSpace="pre-wrap"
                flex="auto auto auto"
                maxWidth="40%"
              >
                <Text
                  color="#FFFFFE"
                  fontSize={["md", "lg", "xl", "2xl"]}
                  textAlign={isUser ? "right" : "left"}
                >
                  {message.text.trim()}
                </Text>
              </Box>
            </Box>
          );
        })}
        <Box
          as="form"
          onSubmit={handleSubmit}
          display="flex"
          textAlign="center"
          width="70%"
          bottom={0}
          mx="auto"
          mt="auto"
          bg="#191827"
          p={4}
        >
          <FormControl>
            <InputGroup size="md">
              <Input
                value={message}
                placeholder="Type a message..."
                onChange={(e) => setMessage(e.target.value)}
                onFocus="red"
                focusBorderColor="#e53170"
                maxLength={200}
              />
              <InputRightElement bg="transparent">
                <IconButton
                  bg="transparent"
                  color="#FFFFFE"
                  _hover={{ color: "#ff8906" }}
                  borderRadius={50}
                  mt={1}
                  mb={1}
                  onClick={handleSubmit}
                >
                  <IoIosSend />
                </IconButton>
              </InputRightElement>
            </InputGroup>
          </FormControl>
        </Box>
      </Stack>
    );
  } else if (error) {
    return <h1>Error fetching conversation</h1>;
  }
  return <h1>Loading</h1>; // Return null or a loading indicator while data is being fetched
};

export default Conversation;
