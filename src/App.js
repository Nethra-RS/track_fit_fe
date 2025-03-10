import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import FitnessPlanner from './components/FitnessPlanner';
import Profile from './components/Profile';

// Import Bootstrap CSS (after installing the package)
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';  

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* Add other routes as needed */}
        <Route path="/goals" element={<div>My Goals</div>} />
        <Route path="/planner" element={<FitnessPlanner />} />
        <Route path="/ai-tool" element={<div>AI Tool</div>} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<div>About</div>} />
        <Route path="/team" element={<div>Team</div>} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;