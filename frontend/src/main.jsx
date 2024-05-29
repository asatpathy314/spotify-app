import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import * as ReactDOM from 'react-dom/client'
import { App } from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Forum from './components/Forum.jsx'


import Login from './routes/Login.jsx'
import Profile from './routes/Profile.jsx'
import {LikedSongs} from './routes/LikedSongs.jsx'
import AuthProvider from './components/AuthProvider.jsx'
import Discover from './routes/Discover.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Login />
      },
      {
        path: '/profile/:id',
        element: <Profile />
      },
      {
        path: '/discover',
        element: <Discover />
      },
      {
        path: '/messages',
        element: <h1>Messages</h1>
      },
      {
        path: '/forum',
        element: <Forum />
      },
      {
        path: '/liked',
        element: <LikedSongs />
      },
    ]
  }
])


const rootElement = document.getElementById('root')
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AuthProvider>
      <ChakraProvider>
        <RouterProvider router={router}/>
      </ChakraProvider>
    </AuthProvider>
  </React.StrictMode>
)