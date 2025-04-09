//resetpass.js
import "./theme.css";
import React, { useState } from "react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password reset successfully!");
  };

  return (
    <div className="reset-container">
      <div className="background"></div>
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