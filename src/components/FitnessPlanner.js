import React, { useState } from 'react';
import Background from './Background';
import Sidebar from './Sidebar';

const FitnessPlanner = () => {
  const [selectedGoals, setSelectedGoals] = useState([false, false, false, false]);

  const toggleGoal = (index) => {
    const newSelectedGoals = [...selectedGoals];
    newSelectedGoals[index] = !newSelectedGoals[index];
    setSelectedGoals(newSelectedGoals);
  };

  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen flex">
      <Background />
      <Sidebar />

      {/* Content Wrapper */}
      <div className="flex-grow flex flex-col px-4 md:px-8 py-6 overflow-auto" style={{ marginLeft: '256px' }}>
        <h1 className="text-3xl font-bold text-white mb-6">Fitness Planner</h1>

        {/* Grid Layout for Checklist, Calendar, and Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow">
          {/* Left Column */}
          <div className="col-span-2 space-y-6 flex flex-col">
            {/* Checklist & Calendar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
              {/* Easy Checklist */}
              <div className="bg-gradient-to-br from-[#F8A13E] to-[#01B1E3] rounded-xl p-4 shadow-lg flex flex-col">
                <h2 className="text-xl font-semibold text-white mb-4">Easy Checklist</h2>
                <div className="space-y-3 flex-grow">
                  {['Today\'s Goal 1', 'Today\'s Goal 2', 'Today\'s Goal 3', 'Today\'s Goal 4'].map((goal, index) => (
                    <div key={index} className="flex items-center text-lg font-bold rounded-lg">
                      <input type="checkbox" checked={selectedGoals[index]} onChange={() => toggleGoal(index)} className="mr-3 h-5 w-5 accent-orange-400" />
                      <span className="text-white">{goal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calendar */}
              <div className="bg-white rounded-lg p-4 text-gray-800 shadow-lg flex flex-col">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Calendar</h2>
                <div className="flex justify-end mb-2">
                  <div className="text-right">
                    <div className="text-xs font-medium text-gray-500">2025</div>
                    <div className="text-xl font-medium italic" style={{ fontFamily: 'cursive' }}>January</div>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <div key={index} className="text-center font-medium text-sm">{day}</div>
                  ))}
                  {calendarDays.slice(0, 28).map((day) => (
                    <div key={day} className="text-center p-1">
                      <div className="w-8 h-8 flex items-center justify-center text-sm">{day}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Buttons Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['User BMI', 'Calorie Intake', 'Days until rest', 'Calories Burnt'].map((text, index) => (
                <button key={index} className="bg-[#F8A13E] text-white py-3 rounded-full font-medium shadow-lg hover:bg-[#F8A13E]/90 transition">
                  {text}
                </button>
              ))}
            </div>

            {/* AI Recommendations */}
            <div className="bg-gradient-to-r from-[#F8A13E] to-[#01B1E3] rounded-xl p-4 shadow-lg flex flex-col">
              <h2 className="text-xl font-semibold text-white mb-4">AI Recommendations</h2>
              <p className="text-white text-center py-6">Example of AI recommending what the user can do next.</p>
            </div>
          </div>

          {/* Right Column: Progress of Goals */}
          <div className="bg-gradient-to-br from-[#F8A13E] to-[#01B1E3] rounded-xl p-6 shadow-lg flex flex-col">
            <h2 className="text-xl font-semibold text-white mb-4">Progress of Goals</h2>
            <div className="flex-grow flex items-center justify-center">
              <p className="text-white text-center">This box will include every goal the user makes with progress bars.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessPlanner;
