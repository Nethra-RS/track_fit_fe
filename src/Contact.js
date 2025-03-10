import React from "react";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import "./Contact.css";
import "./theme.css";
const Contact = () => {
  return (
    <div className="contact-container contactus">
      <div className="background"></div>
      <h2 className="logo1"><span className="trackfit1">trackfit</span><span className="dot1">.</span></h2>
      <h2 className="contact-title">Contact Us!</h2>

      <div className="contact-cards">
        <div className="contact-card">
          <FaInstagram className="contact-icon" />
          <h4>Instagram</h4>
          <p>Follow us on Instagram</p>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            Visit Instagram
          </a>
        </div>

        <div className="contact-card">
          <FaTwitter className="contact-icon" />
          <h4>X (Twitter)</h4>
          <p>Join the conversation on X</p>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            Visit X
          </a>
        </div>

        <div className="contact-card">
          <FaFacebook className="contact-icon" />
          <h4>Facebook</h4>
          <p>Like us on Facebook</p>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            Visit Facebook
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;

