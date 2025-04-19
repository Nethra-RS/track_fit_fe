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
          <a href="https://www.facebook.com/profile.php?id=61575203378588" target="_blank" rel="noopener noreferrer">
            Visit Facebook
          </a>
        </div>

        <div className="contact-card">
           <iframe
             className="contact-map"
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3349.0883243700827!2d-96.9372417!3d32.7356874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864e99d03f682d2f%3A0x31e71df62286a96c!2sUniversity%20of%20Texas%20at%20Arlington!5e0!3m2!1sen!2sus!4v1684045501326!5m2!1sen!2sus"
             allowFullScreen=""
             loading="lazy"
             referrerPolicy="no-referrer-when-downgrade"
             title="TrackFit Location"
           ></iframe>
          <h4>Our Location</h4>
          <p>University of Texas at Arlington, TX</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;

