import React, { useState } from "react";
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Button,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { FaSpotify } from "react-icons/fa";
import axios from "axios";

const Forum = () => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/forum", { name });
      setName(""); // Reset the form
      alert("Post submitted successfully!");
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Failed to submit post.");
    }
  };

  return (
    <Container minHeight="100vh" display="grid">
      <Card
        align="center"
        placeSelf="center"
        backgroundColor="#0F0E17"
        width="100%"
        minWidth="200px"
        height="20%"
        minHeight="150px"
      >
        <form onSubmit={handleSubmit}>
          <FormControl id="name">
            <FormLabel color="white">Name</FormLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="teal"
            mt={4}
            leftIcon={<FaSpotify />}
          >
            Submit
          </Button>
        </form>
      </Card>
    </Container>
  );
};

export default Forum;
