import React, { useState, useEffect  } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth"; 
import "./signin.css";
import image from "./image 1.png";
import image1 from "./image 2.png";

const SignIn = () => {
  const navigate = useNavigate();
  const { user, login, loading, fetchSession } = useAuth(); // 👈 import fetchSession
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const isLogout = params.get("logoutSuccess") === "true";
  
      if (isLogout) {
        setSuccess("Logout successful!");
      // Clean cookies just in case
        document.cookie = "next-auth.session-token=; Max-Age=0; path=/;";
        document.cookie = "next-auth.csrf-token=; Max-Age=0; path=/;";
        window.history.replaceState({}, document.title, window.location.pathname);
      }
  }, []);
  
  useEffect(() => {
      if (!loading && user) {
        navigate("/dashboard");
      }
  }, [user, loading, navigate]);  

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
  
    try {
      const result = await login(email, password);
  
      if (!result.success) {
        setError(result.message || "Invalid email or password.");
      } else {
        await fetchSession();
        setSuccess("Login successful!");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    }
  };
  
  

  const handleGoogleSignIn = () => {
    const backendUrl = process.env.REACT_APP_API_URL;
    const callbackUrl = `${window.location.origin}/dashboard`;
    window.location.href = `${backendUrl}/api/auth/signin/google?callbackUrl=${callbackUrl}`;
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

          <button className="signin-btn" onClick={handleLogin}>
            SIGN IN
          </button>

          <div className="separator">---or---</div>

          <button className="google-btn" onClick={handleGoogleSignIn}>
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
