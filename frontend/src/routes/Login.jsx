import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Button,
} from "@chakra-ui/react";
import { FaSpotify } from "react-icons/fa";

const Login = () => {
  return (
      <Card
        align="center"
        placeSelf="center"
        backgroundColor="#0F0E17"
        width="100%"
        maxWidth="300px"
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
  );
};

export default Login;
