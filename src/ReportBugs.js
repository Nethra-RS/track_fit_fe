import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./ReportBugs.css";
import API_BASE_URL from "./lib/api";

const ReportBugs = () => {
  const [bug, setBug] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate(); // Initialize navigate function

  const handleSubmit = async () => {
    setStatus("Submitting...");
    try {
      const res = await fetch(`${API_BASE_URL}/api/support/report-bug`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bugDescription: bug }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("Bug report sent successfully!");
        setBug("");
        setTimeout(() => navigate(-1), 1500); // Redirect back after short delay
      } else {
        setStatus(data.message || "Failed to send bug report.");
      }
    } catch (error) {
      console.error("Bug report error:", error);
      setStatus("Something went wrong. Please try again.");
    }
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
      {status && <p className="status-text">{status}</p>}
    </div>
  );
};

export default ReportBugs;
