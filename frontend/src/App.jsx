import { Outlet } from "react-router-dom"
 
const App = () => {
  // 2. Wrap ChakraProvider at the root of your app
  return (
      <main>
        <Outlet />
      </main>
  )
}

export default App