import { Outlet } from "react-router-dom"
import { ChakraProvider } from '@chakra-ui/react';
import { Container } from "@chakra-ui/react";
import './App.css';
import SimpleSidebar from "./components/Sidebar";


export const App = () => {
  return (
    <ChakraProvider>
        <main>
          <SimpleSidebar>
            <Container display="grid" minHeight="100vh" minWidth="100%" padding="0">
              <Outlet />
            </Container>
          </SimpleSidebar>
        </main>
    </ChakraProvider>
  );
};