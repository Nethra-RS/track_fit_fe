import React, { useState } from "react";
import { useAuth } from "./useAuth";
import "./signup.css";
import image from "./images.png"; 
import image1 from "./image 2.png";
import "./theme.css";
import API_BASE_URL from "./lib/api";
import { useEffect } from "react";



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
  const [error, setError] = useState("");
  const { register } = useAuth();
  const { signUpWithGoogle } = useAuth();

  useEffect(() => {
    /*const isFirstGoogleLogin = localStorage.getItem("firstGoogleLogin");
    if (isFirstGoogleLogin === "true") {
      localStorage.removeItem("firstGoogleLogin");
      setShowDialog(true); // 🔓 Open profile setup steps
    }*/
  }, []);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
 const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

 const handleSignUp = async () => {
  setError("");
  if (!firstName || !email || !password) {
    setError("All fields are required");
    return;
  }
  if (!emailRegex.test(email)) {
    setError("Please enter a valid email address");
    return;
  }
  if (!passwordRegex.test(password)) {
    setError("Password must be 8+ characters, include uppercase, number, and special character");
    return;
  }

  const result = await register(firstName, email, password);
  if (result.success) {
    setShowDialog(true);
  } else {
    setError(result.message || "Registration failed");
  }
};


const handleNext = async () => {
  setError(""); // Reset previous error
  if (step === 0 && !gender) {
    setError("Please select a gender");
    return;
  }
  if (step === 1 && (!age || parseInt(age) <= 0)) {
    setError("Please enter a valid age");
    return;
  }
  if (step === 2 && (!height || parseInt(height) <= 0)) {
    setError("Please enter a valid height");
    return;
  }
  if (step === 3 && (!weight || parseInt(weight) <= 0)) {
    setError("Please enter a valid weight");
    return;
  }

  if (step === 3) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ gender, age, height, weight }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Failed to save profile");
        return;
      }

      setStep(step + 1);
    } catch (err) {
      setError("Something went wrong while saving your profile.");
      console.error(err);
    }
  } else {
    setStep(step + 1);
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
          
          <div className="status-container">
             {error && <p className="error-message">{error}</p>}
          </div>

          <div className="input-group">
            <label>Full Name</label>
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
          <button className="google-btn" onClick={signUpWithGoogle}>
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
              {step < 4 && <div className="arrow right-arrow" onClick={handleNext}>&#8594;</div>}
            </div>
            <p className="subtext">Registration is successful, Now, Enter your details to get started!</p>
            {error && <p className="error-message" style={{ marginBottom: '10px' }}>{error}</p>}
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
               <label>Weight (lbs)</label>
               <input
                 type="number"
                 placeholder="Enter your weight"
                 value={weight}
                 onChange={(e) => setWeight(e.target.value)}
                />
               <button className="dialogue-submit" onClick={handleNext}>Submit</button>
             </div>
            )}

            {step === 4 && (
             <div>
               <p className="mb-4 text-gray-700">We need access to your Google Fit data to provide personalized insights.</p>
               <div className="flex justify-center gap-4">
               <button className="dialogue-submit" onClick={() => {
               window.location.href = `${API_BASE_URL}/api/google-fit/authorize`;
               }}>Grant Access</button>
               <button className="dialogue-submit bg-gray-300 text-black" onClick={() => {
               window.location.href = "/dashboard";
               }}>Deny</button>
             </div>
           </div>
)}
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;


