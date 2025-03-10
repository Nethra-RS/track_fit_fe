import React from "react";
import { Link, useNavigate } from "react-router-dom";  // Added useNavigate import
import "./signin.css";
import image from "./image 1.png"; // Replace with your actual image path
import image1 from "./image 2.png";

const SignIn = () => {
  const navigate = useNavigate(); // Adding the useNavigate hook

  const handleSignIn = () => {
    // You can add your authentication logic here if needed
    navigate("/dashboard"); // Redirect to Dashboard on successful sign-in
  };

  return (
    <div className="signin-container">
      <div className="background-new"></div>
      <h2 className="logo1"><span className="trackfit1">trackfit</span><span className="dot1">.</span></h2>
      
      {/* Image outside the sign-in box */}
      <div className="signin-image">
        <img src={image} alt="Workout" />
      </div>

      <div className="signin-box">
        {/* Right side - Sign-in form */}
        <div className="signin-form">
          <h2 className="sign">SIGN IN</h2>
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" />
          </div>
          <button className="signin-btn" onClick={handleSignIn}>SIGN IN</button> {/* Updated this line */}

          {/* Separator */}
          <div className="separator">---or---</div>

          {/* Google Sign-In */}
          <button className="google-btn">
            <img src={image1} alt="Logo"/>
            Sign in with Google  
          </button>

          {/* Sign up & Forgot Password Links */}
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





