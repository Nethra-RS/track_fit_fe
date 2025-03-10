import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import About from "./About";
import OurTeam from "./Ourteam";
import "./LandingPage.css";  
import "./theme.css";
import watchImage from "./watch-image.png"; 

const LandingPage = () => {
  const aboutRef = useRef(null);
  const teamRef = useRef(null);
  const homeRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (ref) => {
    if (ref.current) {
      console.log("Scrolling to:", ref.current);
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      console.log("Ref is null");
    }
  };
  

  return (
    <div id = "landing-section" className="landing-container" ref={homeRef}> {/* Apply full-page container */}
      <div className="background"></div>
      {/* Navbar */}
      <nav className="navbar">
        <h2 className="logo"><span className="trackfit">trackfit</span><span className="dot">.</span></h2>
        <button className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <button onClick={() => scrollToSection(aboutRef)}>About</button>
          <button onClick={() => scrollToSection(teamRef)}>Our Team</button>
          <Link to="/signin" className="login-link">Login</Link> 
        </div>
      </nav>

      {/* Landing Section */}
      <section className="landing-page">
        <div className="hero">
          <div className="hero-text">
            <h2>Track<br />Transform<br />Thrive</h2>
            <p>Your personalized path to better health with AI-powered insights.</p>
            <div className="hero-buttons">
              <Link to="/signup">
                <button className="start-button">GET STARTED</button>
              </Link>
              <button className="learn-button" onClick={() => scrollToSection(aboutRef)}>LEARN MORE</button>
            </div>
          </div>
          <div className="hero-image">
            <img src={watchImage} alt="Smartwatch" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} id="about-section" className="About">
        <About />
      </section>

      {/* Team Section */}
      <section ref={teamRef} className="OurTeam">
        <OurTeam />
      </section>
    </div>
  );
};

export default LandingPage;

