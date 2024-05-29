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
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import axios from "axios";

const Profile = () => {
  const { token, setToken, userID, setUserID } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [bio, setBio] = useState("Fill in your bio here!");
  const [profileData, setProfileData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [forbidden, setForbidden] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (!token || !userID) {
      const accessToken = searchParams.get("access_token");
      const userId = searchParams.get("user_id");
      if (accessToken && userId) {
        setToken(accessToken);
        setUserID(userId);
      } else {
        console.log("Error retrieving token and user ID");
      }
    }
    if (id) {
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

  useEffect(() => {
    if (id === userID) {
      setIsEditable(true);
    }
  }, [id, userID]);

  const handleSubmit = async () => {
    // Update the bio and reset the edit mode
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

  if (!forbidden && id !== "nosessiontoken") {
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
              top="10px"
              right="10px"
              bg="#FFFFFE"
              aria-label="Edit Profile"
              onClick={() => {
                setEditMode(true);
                setIsEditable(false);
              }}
            />
          )}
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
    return (
      <Flex height="100%" alignItems="center" justifyContent="center">
        <Heading>
          Please{" "}
          <Link color="#ff8906" href="/">
            login
          </Link>{" "}
          to view this page.
        </Heading>
      </Flex>
    );
  }
};

export default Profile;
