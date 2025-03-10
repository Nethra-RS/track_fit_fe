import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import "./ForgotPassword.css";
import image from "./image 4.png"; // Use the actual image path

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); // ✅ Initialize navigate function

  const handleReset = () => {
    // Simulating password reset logic (normally, you'd send an API request here)
    console.log(`Password reset email sent to: ${email}`);

    // Redirect to Reset Password Confirmation Page
    navigate("/RequestConfirmation");
  };

  return (
    <div className="forgot-container">
      <div className = "background "></div>
      <h2 className="logo1"><span className="trackfit1">trackfit</span><span className="dot1">.</span></h2>
      <div className="forgot-box">
        {/* Left Side - Form */}
        <div className="forgot-form">
          <h2 className="forgot-title">Forgot Password?</h2>
          <p>Enter your trackfit account email to Reset Password</p>
          <p className="head">Email</p>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="reset-btn" onClick={handleReset}>
            Reset Password
          </button>
          <p className="login-text">
            Remember Password? <a href="/signin">Login here.</a>
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="forgot-image">
          <img src={image} alt="Reset Password" />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;


