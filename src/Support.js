
import React from "react";
import "./Support.css";
import { FaQuestionCircle, FaFileContract } from "react-icons/fa"; // Importing icons

const Support = () => {
  return (
    <div className="support-container support-page ">
      {/* Left Section - Support Form */}
      <div className = "background-new "></div>
      <h2 className="logo1">
          <span className="trackfit1">trackfit</span>
          <span className="dot1">.</span>
        </h2>
         {/* Centered Content Wrapper */}
      <div className="content-wrapper">
        {/* Support Title */}
        <h1 className="support-title">Welcome to Support!</h1>

        {/* Support Content */}
        <div className="support-content">
          {/* Left Section - Support Form */}
          <div className="support-form">
            <h3>Hi! How can we help you? Reach out to us!</h3>

            <form>
              <label>Name</label>
              <input type="text" placeholder="Your Name" required />

              <label>Email</label>
              <input type="email" placeholder="Your Email" required />

              <label>Message</label>
              <textarea placeholder="Your Message" required></textarea>

              <button className= "message" type="submit">Send Message</button>
            </form>
          </div>

          {/* Right Section - Helpful Resources */}
          <div className="support-resources">
            <h2 className="helpful">Helpful Resources</h2>

            <div className="resource-card">
              <FaQuestionCircle className="resource-icon" />
              <h4>FAQs</h4>
              <p>Find answers to common questions.</p>
              <a href="/faq">View FAQs</a>
            </div>

            <div className="resource-card">
              <FaFileContract className="resource-icon" />
              <h4>Terms of Service</h4>
              <p>Understand our terms and policies.</p>
              <a href="/tos">Read TOS</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
