import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import image from "./image 4.png";
import API_BASE_URL from "./lib/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }
  
      // ✅ Redirect only if the request is successful
      navigate("/RequestConfirmation");
    } catch (error) {
      alert(error.message);
    }
  };
  

  return (
    <div className="forgot-container">
      <div className="background"></div>
      <h2 className="logo1">
        <span className="trackfit1">trackfit</span>
        <span className="dot1">.</span>
      </h2>

      <div className="forgot-box">
        {/* Image Section - Visible on larger screens only */}
        <div className="forgot-image">
          <img src={image} alt="Reset Password" />
        </div>

        {/* Form Section */}
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
      </div>
    </div>
  );
};

export default ForgotPassword;
