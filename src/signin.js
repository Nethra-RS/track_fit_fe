import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signin.css";
import image from "./image 1.png";
import image1 from "./image 2.png";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check for logout success message on component mount
  useEffect(() => {
    // Check URL for logout success parameter
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('logoutSuccess') === 'true') {
      setSuccess('Logout successful!');
      
      // Remove the query parameter without page refresh
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      // Clear the success message after 5 seconds
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    }
  }, []);

  const handleSignIn = () => {
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    // Hardcoded credentials
    const validEmail = "test@example.com";
    const validPassword = "password123";

    if (email === validEmail && password === validPassword) {
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500); // Redirect after delay
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="signin-container">
      <div className="background-new"></div>
      <h2 className="logo1">
        <span className="trackfit1">trackfit</span>
        <span className="dot1">.</span>
      </h2>

      <div className="signin-image">
        <img src={image} alt="Workout" />
      </div>

      <div className="signin-box">
        <div className="signin-form">
          <h2 className="sign">SIGN IN</h2>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="signin-btn" onClick={handleSignIn}>
            SIGN IN
          </button>

          <div className="separator">---or---</div>

          <button className="google-btn">
            <img src={image1} alt="Logo" />
            Sign in with Google
          </button>

          <div className="signin-links">
            <p className="signup-text">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
            <p className="forgot-password">
              <Link to="/ForgotPassword">Forgot password?</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;