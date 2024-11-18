// src/LoginPage.js
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./LoginPage.css" // Import the CSS file

function LoginPage({ setIsAuthenticated }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("") // State for error message
  const navigate = useNavigate()

  const handleLogin = async () => {
    console.log("from handle login")
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      })
      if (response.data.success) {
        setIsAuthenticated(true)
        localStorage.setItem("user","isAuthenticated")
        navigate("/scanner")
      } else {
        setErrorMessage("Invalid credentials") // Set error message on failed login
      }
    } catch (error) {
      setErrorMessage("Login failed. Please try again.") // Set a different error message if the request fails
    }
  }

  return (
    <div className='login-container'>
      <div className='login-form'>
        <h2>Login</h2>
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='login-input'
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='login-input'
        />
        <button onClick={handleLogin} className='login-button'>
          Login
        </button>

        {/* Error message display */}
        {errorMessage && <p className='error-message'>{errorMessage}</p>}
      </div>
    </div>
  )
}

export default LoginPage
