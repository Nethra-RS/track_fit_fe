import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./ReportBugs.css";

const ReportBugs = () => {
  const [bug, setBug] = useState("");
  const navigate = useNavigate(); // Initialize navigate function

  const handleSubmit = () => {
    console.log("Bug Report Submitted:", bug);
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="Bug-container">
      <div className="background-new"></div>
      <h2 className="logo1">
        <span className="trackfit1">trackfit</span>
        <span className="dot1">.</span>
      </h2>
      <h2>Report a Bug</h2>
      <textarea
        className="issue"
        placeholder="Describe the issue..."
        value={bug}
        onChange={(e) => setBug(e.target.value)}
      ></textarea>
      <button className="Bug" onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default ReportBugs;
