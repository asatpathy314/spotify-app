import { Outlet } from "react-router-dom"
import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { Navbar } from './Navbar.jsx';
import './App.css';

export const App = () => {
  return (
    <ChakraProvider>
      <Navbar />
      <Box ml="200px" p="4">
        <main>
          <Outlet />
        </main>
      </Box>
    </ChakraProvider>
  );
};