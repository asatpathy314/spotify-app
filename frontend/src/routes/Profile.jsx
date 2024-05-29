import { useContext, useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import { AppAvatar } from "../components/AppAvatar";
import {
  Heading,
  Grid,
  GridItem,
  Avatar,
  Stack,
  Text,
  Img,
} from "@chakra-ui/react";
import axios from "axios";

const Profile = () => {
  const { token, setToken, userID, setUserID } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [profileData, setProfileData] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [forbidden, setForbidden] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (id == userID) {
      setIsEditable(true);
    } 
    console.log(token);
    console.log(userID);
    if (!token || !userID) {
      if (searchParams.get("access_token") && searchParams.get("user_id")) {
        setToken(searchParams.get("access_token"));
        console.log(token);
        setUserID(searchParams.get("user_id"));
        console.log(userID);
      } else {
        console.log('Error retrieving token and user ID')
      }
    }
    if (id) {
        axios.get("http://localhost:8000/user?id=" + id)
            .then((res) => {
                setProfileData(res.data);
            })
            .catch((error) => {
                console.error("Error retrieving user:", error);
                setProfileData({error: "Error retrieving User Data. If this is your profile try logging in again."})
            })
    }
  }, [id, userID, token, searchParams, setToken, setUserID, isEditable]);
  if (!forbidden) {
    return (
      <Grid
        h="90%"
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(4, 1fr)"
        color="#FFFFFE"
        gap={4}
      >
        <GridItem colSpan={4} bg="#0f0e17" padding={10}>
          <Stack direction={["column", "row", "row", "row"]} spacing={4}>
            <Avatar
              src={profileData && profileData.pfp}
              size={["3xl", "3xl", "3xl", "3xl"]}
              shape="circle"
            />
            <div>
              <Heading size={["xl", null, null, "2xl"]} color="#FFFFFE">
                User
              </Heading>
              <Heading size={["md", null, null, "lg"]} color="#FFFFFE">
                {profileData && profileData.name}
                {!profileData && "Loading..."}
              </Heading>
              <Text fontSize="xl">
                Hiii! My name is Daniel I love chicken and rice. Hiii! My name
                is Daniel I love chicken and rice.
              </Text>
            </div>
          </Stack>
        </GridItem>
        <GridItem colSpan={2} bg="#0f0e17" padding={10}>
          <Heading size={["sm", "md", null, "lg"]}>My Favorite Song</Heading>
          {profileData === null && <Text>Loading...</Text>}
          {profileData !== null && (
            <>
              <Img
                src={profileData.favoriteSong.album.images[1].url}
                alt={profileData.favoriteSong.name}
                mx="auto" // Add this line to center the image horizontally
                mt="5"
                mb="5"
              />
              <Text fontSize={["lg", "2xl", null, "2xl"]} textAlign="center">
                {profileData.favoriteSong.name}
              </Text>
            </>
          )}
        </GridItem>
        <GridItem colSpan={2} bg="#0f0e17" padding={10}>
          <Heading size={["sm", "md", null, "lg"]}>My Favorite Artist</Heading>
          {profileData === null && <Text>Loading...</Text>}
          {profileData !== null && (
            <>
              <Img
                src={profileData.favoriteArtist.images[1].url}
                alt={profileData.favoriteArtist.name}
                mx="auto" // Add this line to center the image horizontally
                mt="5"
                mb="5"
              />
              <Text fontSize={["lg", "2xl", null, "2xl"]} textAlign="center">
                {profileData.favoriteArtist.name}
              </Text>
            </>
          )}
        </GridItem>
      </Grid>
    );
  }
};

export default Profile;
