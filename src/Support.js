
import React from "react";
import "./Support.css";
import { FaQuestionCircle, FaFileContract } from "react-icons/fa"; // Importing icons
import API_BASE_URL from "./lib/api";

const Support = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [status, setStatus] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
  
    try {
      const res = await fetch(`${API_BASE_URL}/api/support/send-ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });
  
      const data = await res.json();
      if (res.ok) {
        setStatus("Support request sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus(data.message || "Failed to send message.");
      }
    } catch (err) {
      console.error("Support request error:", err);
      setStatus("Something went wrong. Please try again.");
    }
  };
  

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

            <form onSubmit={handleSubmit}>
              <label>Name</label>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <label>Email</label>
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label>Message</label>
              <textarea
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />

              <button className= "message" type="submit">Send Message</button>
            </form>
            {status && <p className="status-text">{status}</p>}
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
