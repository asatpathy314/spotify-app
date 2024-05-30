import { useContext, useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import {
  Heading,
  Grid,
  GridItem,
  Avatar,
  Stack,
  Text,
  Img,
  Flex,
  Link,
  IconButton,
  Textarea,
  Container,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Box,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { IoIosSend } from "react-icons/io";
import axios from "axios";

// Profile page and useContext setup. Users are redirected here after the login.
const Profile = () => {
  const { token, setToken, userID, setUserID } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams(); 
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");
  const [profileData, setProfileData] = useState(null); // Retrieved user Data.
  const [editMode, setEditMode] = useState(false); // Determines whether to display the edit box or not.
  const [isEditable, setIsEditable] = useState(false); // Determines if the user has permission to edit the bio/Whether to display edit icon.
  const [forbidden, setForbidden] = useState(null); // Determines if the user has permission to view the page
  const { id } = useParams();

  useEffect(() => { // Check if the user is coming from the login page
    if (!token || !userID) {
      const accessToken = searchParams.get("access_token");
      const userId = searchParams.get("user_id");
      if (accessToken && userId) {
        setToken(accessToken);
        setUserID(userId);
      } else {
        console.error("Error retrieving token and user ID");
      }
    }
    if (id) { // Fetch the user data from the local API
      axios
        .get("http://localhost:8000/user?id=" + id)
        .then((res) => {
          setProfileData(res.data);
          setBio(res.data.bio || "Fill in your bio here!")
        })
        .catch((error) => {
          console.error("Error retrieving user:", error);
          setProfileData({
            error:
              "Error retrieving User Data. If this is your profile try logging in again.",
          });
        });
    }
  }, [id, searchParams, setToken, setUserID, token, userID]);

  useEffect(() => { // Check if the user has permission to edit the data.
    if (id === userID) {
      setIsEditable(true);
    }
  }, [id, userID, setIsEditable]);

  const handleSubmit = async () => {
    // Update the bio and reset the edit mode. Bio is already updated locally by onChange for TextArea
    setEditMode(false);
    setIsEditable(true);
    try {
      await axios.post(
        "http://localhost:8000/user?id=" + id + "&bio=" + bio
      );
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleMessageSubmit = async () => {
    console.log(message)
    axios.post(
      "http://localhost:8000/messages/createConversation",
      {
        user1Id: userID,
        user2Id: id,
        content: message
      }
    )
    setMessage("")
    onClose()
  }

  if (id !== "nosessiontoken") {
    return (
      <Grid
        h="90%"
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(4, 1fr)"
        gap={4}
      >
        <GridItem colSpan={4} bg="#0f0e17" padding={10} position="relative">
          {isEditable && (
            <IconButton
              icon={<EditIcon />}
              position="absolute"
              bg="transparent"
              top="10px"
              right="10px"
              color="#FFFFFE"
              _hover={{ color: "#ff8906" }}
              aria-label="Edit Profile"
              onClick={() => {
                setEditMode(true);
                setIsEditable(false);
              }}
            />
          )}
          {!isEditable && (
            <>
            <IconButton
              position="absolute"
              bg="transparent"
              top="10px"
              right="10px"
              fontSize={'2em'}
              color="#FFFFFE"
              onClick={onOpen}
              _hover={{ color: "#ff8906" }}
              icon={<IoIosSend />}
            />
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent color="#FFFFFE" bg="#0f0e17">
                <ModalHeader>Start a conversation!</ModalHeader>
                <ModalBody>
                <Input 
                placeholder='Type a message...' 
                onChange={(e) => setMessage(e.target.value)}
                _hover={{ borderColor: '#ff8906' }}
                focusBorderColor="#ff8906"/>
                </ModalBody>
                <ModalCloseButton />
                <ModalFooter>
                  <Button bg='#e53170' mr={3} onClick={onClose}>
                    Close
                  </Button>
                  <Button bg="#ff8906" onClick={handleMessageSubmit}>Submit</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            </>
            
          )

          }
          <Stack direction={["column", "row", "row", "row"]} spacing={4}>
            <Avatar
              src={profileData?.profile}
              size={["3xl", "3xl", "3xl", "3xl"]}
              shape="circle"
            />
            <Container width="100%">
              <Stack direction="column" gap={3} height="100%">
                <Heading size={["xl", null, null, "2xl"]}>User</Heading>
                <Heading size={["md", null, null, "lg"]}>
                  {profileData?.name || "Loading..."}
                </Heading>
                {editMode ? (
                  <>
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Hi! My name is Daniel I love the Beatles!"
                      resize="none"
                      size="xl"
                      borderRadius="xl"
                      padding={3}
                      bg="#191827"
                      width="100%"
                      height="100%"
                      fontSize="xl"
                      focusBorderColor="white"
                      _hover={{ borderColor: '#ff8906' }}
                      maxLength={350}
                    />
                    <Button
                      bg="#ff8906"
                      onClick={handleSubmit}
                      width="20%"
                      height="20%"
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <Text fontSize="xl">
                    {bio}
                  </Text>
                )}
              </Stack>
            </Container>
          </Stack>
        </GridItem>
        <GridItem colSpan={2} bg="#0f0e17" padding={10}>
          <Heading size={["sm", "md", null, "lg"]}>My Favorite Song</Heading>
          {profileData === null && <Text>Loading...</Text>}
          {profileData && (
            <>
              <Img
                src={profileData?.favoriteSong?.album?.images?.[1]?.url}
                alt={profileData?.favoriteSong?.name}
                mx="auto"
                mt="5"
                mb="5"
              />
              <Text fontSize={["lg", "2xl", null, "2xl"]} textAlign="center">
                {profileData?.favoriteSong?.name}
              </Text>
            </>
          )}
        </GridItem>
        <GridItem colSpan={2} bg="#0f0e17" padding={10}>
          <Heading size={["sm", "md", null, "lg"]}>My Favorite Artist</Heading>
          {profileData === null && <Text>Loading...</Text>}
          {profileData && (
            <>
              <Img
                src={profileData?.favoriteArtist?.images?.[1]?.url}
                alt={profileData?.favoriteArtist?.name}
                mx="auto"
                mt="5"
                mb="5"
              />
              <Text fontSize={["lg", "2xl", null, "2xl"]} textAlign="center">
                {profileData?.favoriteArtist?.name}
              </Text>
            </>
          )}
        </GridItem>
      </Grid>
    );

  } else if (id === "nosessiontoken") {
    // If the user is not logged in, redirect them to the login page.
    return (
      <Flex height="100%" alignItems="center" justifyContent="center">
        <Heading>
          Please{" "}
          <Link color="#ff8906" href="/" textDecoration={"underline"}>
            login
          </Link>{" "}
          to view this page.
        </Heading>
      </Flex>
    );
  }
};

export default Profile;
