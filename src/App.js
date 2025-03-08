import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import FitnessPlanner from './components/FitnessPlanner';
import Settings from './components/Settings';
import Profile from './components/Profile';
import Goals from './components/MyGoals';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/planner" element={<FitnessPlanner />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/goals" element={<Goals />} />
      </Routes>
    </Router>
  );
}

export default App;