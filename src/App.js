import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import FitnessPlanner from './components/FitnessPlanner';
import Settings from './components/Settings';
import Profile from './components/Profile';
import Goals from './components/MyGoals';
import GoalDescription from './components/GoalsDescription';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/planner" element={<FitnessPlanner />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/goals/:id" element={<GoalDescription/>}/>
      </Routes>
    </Router>
  );
}

export default App;