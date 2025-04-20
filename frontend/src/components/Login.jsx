import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ setIsLoggedIn }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      setError("Both fields are required.");
      return;
    }

    // Replace with actual authentication logic
    if (credentials.username === "admin" && credentials.password === "password") {
      setIsLoggedIn(true); // Update login state
      navigate("/data-parser"); // Redirect to dashboard after login
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Login to <span className="brand-name">BlueWatch</span></h1>
        
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;