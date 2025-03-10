import React from "react";
import { Link } from "react-router-dom";
import "./TOS.css";

const TOS = () => {
  return (
    <div className="tos-container Tos-page">
      <div className="background-new"></div>
      <h2 className="tos-title">trackfit. Terms of Service</h2>

      <div className="tos-content">
        <p>Welcome to TrackFit! These Terms of Service ("Terms") govern your use of the TrackFit website, mobile app, and services. By accessing or using TrackFit, you agree to comply with these Terms. If you do not agree, please do not use our services.</p>

        <h3>User Accounts & Eligibility</h3>
        <ul>
          <li>You must be at least 13 years old to create an account. If you are under 18, parental consent is required.</li>
          <li>You are responsible for maintaining the security of your account credentials.</li>
          <li>TrackFit reserves the right to suspend or terminate accounts that violate these Terms.</li>
        </ul>

        <h3>Use of Services</h3>
        <ul>
          <li>TrackFit provides tools for fitness tracking, workout logging, and health insights.</li>
          <li>You may not use TrackFit for illegal, harmful, or abusive activities.</li>
          <li>TrackFit does not provide medical or professional fitness advice; always consult a healthcare provider before making fitness-related decisions.</li>
        </ul>

        <h3>Google Fit Integration & Data Sync</h3>
        <ul>
          <li>To provide accurate tracking of your daily activity, you must allow TrackFit to sync data through the Google Fit API.</li>
          <li>By granting access, TrackFit can retrieve and display fitness data such as steps, calories burned, and workouts.</li>
          <li>You can manage or revoke Google Fit permissions at any time through your device settings.</li>
        </ul>

        <h3>Data Privacy & Security</h3>
        <ul>
          <li>We collect and store data related to your fitness activities to improve your experience.</li>
          <li>Your data is protected under our Privacy Policy and will not be shared with third parties without consent.</li>
          <li>You can request data deletion by contacting support.</li>
        </ul>

        <h3>Limitations & Disclaimers</h3>
        <ul>
          <li>TrackFit is not responsible for inaccurate data due to user input errors or third-party device malfunctions.</li>
          <li>The app is provided "as is" without warranties of any kind.</li>
          <li>We are not liable for injuries or health issues arising from fitness activities logged on TrackFit.</li>
        </ul>

        <h3>Account Termination</h3>
        <ul>
          <li>Users may delete their accounts at any time.</li>
          <li>TrackFit reserves the right to terminate accounts that violate these Terms, including fraudulent or abusive activity.</li>
        </ul>

        <h3>Changes to Terms</h3>
        <p>We may update these Terms occasionally. Continued use of TrackFit after updates constitutes acceptance of the revised Terms.</p>

        <h3>Contact Us</h3>
        <p>For any questions regarding these Terms, please contact us at <strong className="TOC"><Link to="/Support">Support</Link></strong>.</p>
      </div>
    </div>
  );
};

export default TOS;

