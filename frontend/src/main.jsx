import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import * as ReactDOM from 'react-dom/client'
import { App } from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './routes/Login.jsx'
import AuthProvider from './components/AuthProvider.jsx'

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
        path: '/profile',
        element: <h1>profile</h1>
      },
      {
        path: '/messages',
        element: <h1>Messages</h1>
      },
      {
        path: '/profile',
        element: <h1>profile</h1>
      }
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