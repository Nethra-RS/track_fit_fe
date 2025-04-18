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
import About from "./components/About";
import Team from "./components/OurTeam";
import Support from "./Support";
import ReportBugs from "./ReportBugs";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import FitnessPlanner from "./components/FitnessPlanner";
import Profile from "./components/Profile";
import MyGoalsPage from "./components/MyGoals";
import GoalDescription from "./components/GoalsDescription";
import ResetPassword from "./resetpass";

// Import Bootstrap CSS (after installing the package)
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "./App.css";
import "./theme.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route
          path="/RequestConfirmation"
          element={<ResetPasswordConfirmation />}
        />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/TOS" element={<TOS />} />
        <Route path="/Support" element={<Support />} />
        <Route path="/ReportBugs" element={<ReportBugs />} />

        <Route path="/dashboard" element={<Dashboard />} />
        {/* Add other routes as needed */}
        <Route path="/goals" element={<MyGoalsPage />} />
        <Route path="/planner" element={<FitnessPlanner />} />
        <Route path="/ai-tool" element={<div>AI Tool</div>} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About/>} />
        <Route path="/team" element={<Team />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/goals/:id" element={<GoalDescription />} />
        <Route path= "/resetpassword" element={<ResetPassword/>} />
      </Routes>
    </Router>
  );
};

export default App;
