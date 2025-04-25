import "./theme.css";
import "./resetpass.css";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API_BASE_URL from "./lib/api";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [token, setToken] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const resetToken = queryParams.get("token");
    setToken(resetToken);

    if (!resetToken) {
      setError("Invalid or expired reset link.");
      setTimeout(() => navigate("/ForgotPassword"), 3000);
    }
  }, [location.search, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      setError("Password must be 8+ characters, include uppercase, number, and special character.");
      return;
    }

    if (password !== password2) {
      setError("Passwords do not match!");
      return;
    }

    if (!token) {
      setError("Invalid or missing token.");
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

      setSuccess("✅ Password reset successful!");
      setTimeout(() => navigate("/signin"), 2000);
    } catch (error) {
      console.error("❌ Reset error:", error);
      setError(error.message || "Password reset failed.");
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

          <div className="status-container">
            {error && <p className="error-message">{error}</p>}
            {!error && success && <p className="success-message">{success}</p>}
          </div>

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
