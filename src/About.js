import React from "react";
import "./About.css"; // Import the styles
import "./theme.css"; 

const About = () => {
  return (
    <div className="about-container">
      <div className="background"></div> 
      <div className="about-box">
        <h2>Get on track</h2>
        <p>
          This project/website is an AI-powered fitness tracker designed to help you monitor workouts, track progress, and receive personalized insights based on your activity and goals. Our platform analyzes your data to provide smart recommendations, optimize performance, and keep you motivated. Whether you're a beginner or a fitness enthusiast, we make tracking your health effortless and effective.
        </p>
      </div>
    </div>
  );
};

export default About;
