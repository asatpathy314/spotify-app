import { Outlet } from "react-router-dom"
import { ChakraProvider } from '@chakra-ui/react';
import { Container } from "@chakra-ui/react";
import './App.css';
import SimpleSidebar from "./components/Sidebar";

// Don't mess with the container. It's a necessary component for the sidebar and all the CSS to work.
export const App = () => {
  return (
    <ChakraProvider>
          <main>
            <SimpleSidebar>
              <Container display="grid" minHeight="100vh" minWidth="100%" padding="0" color="#FFFFFE">
                <Outlet />
              </Container>
            </SimpleSidebar>
          </main>
    </ChakraProvider>
  );
};