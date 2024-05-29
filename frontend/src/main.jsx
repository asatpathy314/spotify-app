import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import * as ReactDOM from 'react-dom/client'
import { App } from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
//import Login from './components/Login.jsx'
import Forum from './components/Forum.jsx'


import Login from './routes/Login.jsx'
import Profile from './routes/Profile.jsx'
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
    ]
  },
  {
    path: '/forbidden',
    element: <h1>403 Forbidden</h1>
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