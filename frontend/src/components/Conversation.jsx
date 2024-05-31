import { useContext, useEffect, useState } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import {
  Text,
  Stack,
  Box,
  Input,
  FormControl,
  InputGroup,
  InputRightElement,
  IconButton,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { IoIosSend } from "react-icons/io";
import { ArrowBackIcon } from "@chakra-ui/icons";
import axios from "axios";

// Profile page and useContext setup. Users are redirected here after the login.
const Conversation = () => {
  const { token, setToken, userID, setUserID } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [messageData, setMessageData] = useState(null); // Data for the conversation
  const [userName, setUserName] = useState(null); // Name of the user
  const [forbidden, setForbidden] = useState(null); // Determines if the user has permission to view the page
  const [error, setError] = useState(null); // Error handling
  const { id } = useParams();
  const [message, setMessage] = useState(""); // Local message state
  const navigate = useNavigate();

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
          const userID1 = res.data.user1._path.segments[1].trim();
          const userID2 = res.data.user2._path.segments[1].trim();
          if (userID1 !== userID && userID2 !== userID) {
            window.location.href=("/messages")
          }
          const queryID = userID1 === userID ? userID2 : userID1;
          axios.get(`http://localhost:8000/user?id=${queryID}`)
          .then((res) => {
            if (res.status === 200) {
              setUserName(res.data.name);
            }
          })
          .catch((err) => {console.error(err)});
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
      const res = await axios.get(`http://localhost:8000/user/getDocRef?id=${userID}`);
      if (res.status === 200) {
        const newMessageDocRef = res.data;
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
      }
    } catch (error) {
      console.error("Error submitting message:", error);
    }
  };

  if (messageData) {
    return (
      <Stack gap={3}>
        <Flex alignItems="center" p={4} bg="#191827" color="#FFFFFE" textAlign={"center"}>
          <IconButton
            icon={<ArrowBackIcon />}
            onClick={() => navigate("/messages")}
            bg="transparent"
            color="#FFFFFE"
            _hover={{ color: "#ff8906" }}
            aria-label="Back"
          />
          <Heading as="h2" size="lg" mx='auto'>
            {userName}
          </Heading>
        </Flex>
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
  return (
    <Flex height="100%" alignItems="center" justifyContent="center">
    <Heading>
      Loading
    </Heading>
    </Flex>
  ) // Return null or a loading indicator while data is being fetched
};

export default Conversation;
