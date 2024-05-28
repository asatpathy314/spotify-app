import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  Spinner,
  Box,
} from "@chakra-ui/react";
import { FaSpotify } from "react-icons/fa";
import axios from "axios";


const Forum = () => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forumId, setForumId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");


  useEffect(() => {
    const fetchForums = async () => {
      try {
        const response = await axios.get("http://localhost:8000/forum/forums");
        console.log("Fetched forums:", response.data.forums);  // Add this line
        setForums(response.data.forums);
      } catch (error) {
        console.error("Error fetching forums:", error);
      } finally {
        setLoading(false);
      }
    };


    fetchForums();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8000/forum/forums/${forumId}/posts`, { title, description, userId: "spotify_user_id" });
      setTitle("");
      setDescription("");
      alert("Post created successfully!");
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Failed to submit post.");
    }
  };


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }


  return (
    <Container minHeight="100vh" display="grid">
      <Card align="center" placeSelf="center" backgroundColor="#0F0E17" width="100%" minWidth="200px" height="20%" minHeight="150px">
        <form onSubmit={handleSubmit}>
          <FormControl id="forum">
            <FormLabel color="white">Select Forum</FormLabel>
            <Select
              placeholder="Select forum"
              value={forumId}
              onChange={(e) => setForumId(e.target.value)}
              required
            >
              {forums.length > 0 ? forums.map((forum) => (
                <option key={forum.id} value={forum.id}>{forum.name}</option>
              )) : <option>No forums available</option>}
            </Select>
          </FormControl>
          <FormControl id="title" mt={4}>
            <FormLabel color="white">Title</FormLabel>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </FormControl>
          <FormControl id="description" mt={4}>
            <FormLabel color="white">Description</FormLabel>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </FormControl>
          <Button type="submit" colorScheme="teal" mt={4} leftIcon={<FaSpotify />}>
            Submit
          </Button>
        </form>
      </Card>
    </Container>
  );
};


export default Forum;
