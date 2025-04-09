//Googlefit.js
import React from "react";
import "./theme.css";

const GoogleFitAccess = () => {
  const handleAuthorize = () => {
    console.log("Google Fit authorization triggered.");
  };

  return (
    <div className="google-fit-page">
      {/* Background styling */}
      <div className="background"></div>

      {/* Logo */}
      <div className="logo1 responsive-logo">
        <span className="trackfit1">TrackFit</span>
        <span className="dot1">.</span>
      </div>

      {/* Authorization Box */}
      <div className="access-box">
        <div className="access-form">
          <h2 className="access-heading">Access Google Fit</h2>
          <p className="access-text">
            To proceed, please allow us to access your Google Fit data for
            activity tracking and personalized experience.
          </p>
          <button className="authorize-btn" onClick={handleAuthorize}>
            Authorize Google Fit
          </button>
        </div>
      </div>

      <style jsx>{`
        .google-fit-page {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          position: relative;
        }

        .responsive-logo {
          position: absolute;
          top: 20px;
          left: 80px;
        }

        .access-box {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .access-form {
          background-color: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          text-align: center;
        }

        .access-heading {
          font-size: 1.75rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .access-text {
          margin-bottom: 1.5rem;
          color: black;
        }

        .authorize-btn {
          background-color: #f8a13e;
          color: white;
          padding: 0.75rem;
          width: 100%;
          font-size: 1.125rem;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .authorize-btn:hover {
          background-color: #e28b2c;
        }

        @media (max-width: 768px) {
          .responsive-logo {
            position: static;
            margin-bottom: 1rem;
          }
          .access-box {
            height: auto;
            padding: 2rem 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default GoogleFitAccess;
