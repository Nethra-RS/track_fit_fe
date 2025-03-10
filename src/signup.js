import React, { useState } from "react";
import "./signup.css";
import image from "./images.png"; 
import image1 from "./image 2.png";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const handleSignUp = () => {
    setShowDialog(true);
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Submit details and redirect to dashboard
      console.log({ gender, age, height, weight });
      setShowDialog(false);
      // Redirect to dashboard here
      window.location.href = "/dashboard"; // Replace with actual dashboard path
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="signup-container signup-page">
      <div className = "background"></div>
      <h2 className="logo1"><span className="trackfit1">trackfit</span><span className="dot1">.</span></h2>
      {/* Left side - Image */}
      <div className="signup-image">
          <img src={image} alt="Workout" />
      </div>

      <div className="signup-box">
        {/* Right side - Sign-up form */}
        <div className="signup-form">
          <h2 className="Up">SIGN UP</h2>
          
          <div className="input-group">
            <label>First Name</label>
            <input
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button className="signup-btn" onClick={handleSignUp}>SIGN UP</button>

          {/* Separator */}
          <div className="separator">--- or ---</div>

          {/* Google Sign-Up */}
          <button className="google-btn">
            <img src={image1} alt="Logo"/>
            Sign up with Google
          </button>

          {/* Login link */}
          <p className="login-text">
            Already have an account? <a href="/signin">Login here</a>
          </p>
        </div>
      </div>

      {/* Responsive Dialogue */}
      {showDialog && (
        <div className="dialogue-container">
          <div className="dialogue-box">
            <div className="dialogue-header">
              {step > 0 && <div className="arrow left-arrow" onClick={handleBack}>&#8592;</div>}
              <h3>Complete Setup!</h3>
              {step < 3 && <div className="arrow right-arrow" onClick={handleNext}>&#8594;</div>}
            </div>
            <p className="subtext">Enter your details to get started!</p>
            {step === 0 && (
              <div>
                <label>Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}
            {step === 1 && (
              <div>
                <label>Age</label>
                <input
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
            )}
            {step === 2 && (
              <div>
                <label>Height (cm)</label>
                <input
                  type="number"
                  placeholder="Enter your height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
            )}
            {step === 3 && (
              <div>
                <label>Weight (kg)</label>
                <input
                  type="number"
                  placeholder="Enter your weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            )}
            {step === 3 && <button className="dialogue-submit" onClick={handleNext}>Submit</button>}
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;


