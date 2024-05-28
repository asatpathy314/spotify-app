import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraBaseProvider, extendBaseTheme } from '@chakra-ui/react';
import { theme as chakraTheme } from '@chakra-ui/theme';
import App from './App';
import './index.css';

// Extracting the Button component theme
const { Button } = chakraTheme.components;

// Creating a custom theme with only the Button component's default theme
const theme = extendBaseTheme({
  components: {
    Button,
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ChakraBaseProvider theme={theme}>
      <App />
    </ChakraBaseProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
