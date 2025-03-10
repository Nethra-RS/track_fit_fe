import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import SignIn from "./signin";
import SignUp from "./signup";
import ForgotPassword from "./ForgotPassword";
import ResetPasswordConfirmation from "./RequestConfirmation";
import Contact from "./Contact";
import FAQ from "./FAQ";
import TOS from "./TOS";
import Support from "./Support";
import ReportBugs from "./ReportBugs";
import './App.css';
import './theme.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/RequestConfirmation" element={<ResetPasswordConfirmation />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/TOS" element={<TOS />} />
        <Route path="/Support" element={<Support />} />
        <Route path="/ReportBugs" element={<ReportBugs />} />
      </Routes>
    </Router>
  );
}

export default App;

