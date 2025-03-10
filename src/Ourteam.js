import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "./Ourteam.css";
import { FaDatabase, FaCode, FaPaintBrush, FaProjectDiagram, FaLaptopCode } from "react-icons/fa";

const teamMembers = [
  { name: "Ram Mankar", role: "Project Leader", icon: <FaProjectDiagram size={50} /> },
  { name: "Amit Reny", role: "Backend Developer", icon: <FaDatabase size={50} /> },
  { name: "Vaishnavi Sampara", role: "Frontend Developer", icon: <FaLaptopCode size={50} /> },
  { name: "Rea Jair", role: "UI/UX Designer", icon: <FaPaintBrush size={50} /> },
  { name: "Renjarla Nethra", role: "Backend Developer", icon: <FaCode size={50} /> },
];

const OurTeam = () => {
  const navigate = useNavigate(); // Hook for navigation

  // Function to go back to home page
  const goToHome = () => {
    window.location.href = "/"; // Navigates back to Landing Page
  };

  const goToAbout = () => {
    navigate("/"); // Navigate back to Landing Page first
    setTimeout(() => {
      document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      <div className="our-team-container">
        <h2>Say Hi!</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-member">
              <div className="icon-container">{member.icon}</div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="footer-container">
        <div className="left">
          <span className="brand-name">trackfit.</span>
        </div>
        <div className="right">
          <div className="column">
            <ul>
              <li><button onClick={goToHome}>Home</button></li>
              <li><button onClick={goToAbout}>About</button></li>
              <li><Link to="/Contact">Contact Us</Link></li>
              <li><Link to="/signup">SignUp</Link></li>
            </ul>
          </div>
          <div className="column">
            <ul>
              <li><Link to="/FAQ">FAQs</Link></li>
              <li><Link to="/TOS">TOS</Link></li>
              <li><Link to="/Support">Support</Link></li>
              <li><Link to="/ReportBugs">Report Bugs</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default OurTeam;



