// src/App.js
import React, { useEffect, useState  } from "react"

import {
  Route,
  Routes,
  Navigate,
  useNavigate
} from "react-router-dom"
import LoginPage from "./LoginPage"
import ScannerPage from "./ScannerPage"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  // useEffect(()=>{
  //   const user = localStorage.getItem("user")
  //   console.log(user)
  //   console.log(user === "isAuthenticated")
  //   if(user && user === "isAuthenticated"){
  //     setIsAuthenticated(()=>{
  //       navigate("/scanner")
  //       return true
  //     })

  //   }
  // // eslint-disable-next-line
  // },[])

  return (
    
      <Routes>
        <Route
          path='/'
          element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
        />

        <Route
          path='/scanner'
          element={
            // isAuthenticated ? (
              <ScannerPage setIsAuthenticated={setIsAuthenticated} />
             // ) : (
            //   <Navigate to='/' replace />
            // )
          }
        />
      </Routes>
  )
}

export default App
