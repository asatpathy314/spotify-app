import { useContext } from "react";
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
    <Container minHeight="100vh" display="grid">
      <Card
        align="center"
        placeSelf="center"
        backgroundColor="#0F0E17"
        width="100%"
        minwidth="200px"
        height="20%"
        minHeight="150px"
      >
        <CardHeader color="#FFFFFE">
          <Heading size="lg">Login with Spotify</Heading>
        </CardHeader>
        <CardBody>
          <Button colorScheme="green" leftIcon={<FaSpotify />}>
            Login
          </Button>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Login;
