import { useContext } from "react";
import axios from "axios";
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Button,
} from "@chakra-ui/react";
import { FaSpotify } from "react-icons/fa";

const Login = () => {
  return (
    <Container minHeight="100vh" minWidth="100vw" display="grid">
      <Card
        align="center"
        placeSelf="center"
        backgroundColor="#0F0E17"
        width="400px"
        height="20%"
        minHeight="150px"
      >
        <CardHeader color="#FFFFFE">
          <Heading size="lg">Login with Spotify</Heading>
        </CardHeader>
        <CardBody>
          <a href="http://localhost:8000/auth/login">
          <Button colorScheme="green" leftIcon={<FaSpotify />} >
            Login
          </Button>
          </a>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Login;
