import React from "react";
import "./RequestConfirmation.css";
import image from "./image 4.png";

const ResetPasswordConfirmation = () => {
  return (
    <div className="resend-container">
      <div className="background-new"></div>
      <h2 className="logo1">
        <span className="trackfit1">trackfit</span>
        <span className="dot1">.</span>
      </h2>

      <div className="resend-box">
        {/* Image Section - Visible on larger screens only */}
        <div className="resend-image">
          <img src={image} alt="Resend Password" />
        </div>

        {/* Form Section */}
        <div className="resend-form">
          <h2 className="reset">Reset Password</h2>
          <p>
            Instructions to reset your password have been sent to your email.
          </p>

          <button className="resend">
            <a href="/ForgotPassword">Resend Email</a>
          </button>

          <button className="goback-btn">
            <a href="/signin">Go Back to Login</a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordConfirmation;
