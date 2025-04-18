//resetpass.js
import "./theme.css";
import "./resetpass.css";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API_BASE_URL from "./lib/api";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [token, setToken] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 🌐 Extract token from query param
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const resetToken = queryParams.get("token");
    setToken(resetToken);

    if (!resetToken) {
      alert("Invalid or expired reset link.");
      navigate("/ForgotPassword");
    }
  }, [location.search, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      alert("Passwords do not match!");
      return;
    }

    if (!token) {
      alert("Invalid or missing token.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      alert("✅ Password reset successful!");
      navigate("/signin");
    } catch (error) {
      console.error("❌ Reset error:", error);
      alert(error.message || "Password reset failed.");
    }
  };

  return (
    <div className="reset-container">
      <div className="background-new"></div>
      <h2 className="logo1">
        <span className="trackfit1">trackfit</span>
        <span className="dot1">.</span>
      </h2>
      <div className="reset-box">
        <div className="reset-form">
          <h2 className="reset">RESET PASSWORD</h2>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your new password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
              />
            </div>

            <button className="change-btn" type="submit">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;