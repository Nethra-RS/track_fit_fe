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

  // Calendar data - simplified for example
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
  
  return (
    <div className="min-h-screen font-ubuntu flex relative">
      {/* Background Component - which includes the header */}
      <Background />
      <Sidebar />

      {/* Scrollable Content Area */}
      <div 
        className="flex-grow overflow-auto relative z-10" 
        style={{ 
          marginLeft: '256px', 
          marginTop: '64px',
          padding: '0 32px 32px 32px'
        }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white font-ubuntu">Fitness Planner</h1>
        </div>
        
        {/* Section Headings - Now 2 columns for the left side */}
        <div className="grid grid-cols-3 gap-6 mb-4">
          <h2 className="text-xl font-semibold text-white">Easy Checklist</h2>
          <h2 className="text-xl font-semibold text-white">Calendar</h2>
          <h2 className="text-xl font-semibold text-white">Progress of Goals</h2>
        </div>
        
        {/* Main Layout with 2 columns */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column for Checklist, Calendar, Buttons and AI Recommendations */}
          <div className="col-span-2 space-y-6">
            {/* Top Row - Checklist and Calendar */}
            <div className="grid grid-cols-2 gap-6">
              {/* Easy Checklist */}
              <div className="bg-gradient-to-br from-[#F8A13E] to-[#01B1E3] rounded-xl p-4 shadow-lg">
                <div className="space-y-3">
                  {['Today\'s Goal 1', 'Today\'s Goal 2', 'Today\'s Goal 3', 'Today\'s Goal 4'].map((goal, index) => (
                    <div key={index} className="flex items-center bg-white/30 backdrop-blur-sm p-3 rounded-lg">
                      <input 
                        type="checkbox" 
                        id={`goal-${index}`} 
                        checked={selectedGoals[index]}
                        onChange={() => toggleGoal(index)}
                        className="mr-3 h-5 w-5 accent-orange-400"
                      />
                      <label htmlFor={`goal-${index}`} className="text-white">{goal}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Calendar */}
              <div className="bg-white rounded-lg p-4 text-gray-800 shadow-lg flex flex-col">
                <div className="flex justify-end mb-2">
                  <div className="text-right">
                    <div className="text-xs font-medium text-gray-500">2025</div>
                    <div className="text-xl font-medium italic" style={{ fontFamily: 'cursive' }}>January</div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="grid grid-cols-7 gap-1">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                      <div key={index} className="text-center font-medium text-sm">{day}</div>
                    ))}
                    {/* First row might have empty cells depending on the month start */}
                    <div className="text-center"></div>
                    <div className="text-center"></div>
                    <div className="text-center"></div>
                    {calendarDays.slice(0, 28).map((day) => (
                      <div key={day} className="text-center p-1">
                        <div className="w-8 h-8 flex items-center justify-center text-sm">
                          {day}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Buttons - First Row */}
            <div className="grid grid-cols-2 gap-6">
              <button className="bg-[#F8A13E] text-white py-3 rounded-full font-medium text-lg shadow-lg hover:bg-[#F8A13E]/90 transition-colors">
                User BMI
              </button>
              <button className="bg-[#F8A13E] text-white py-3 rounded-full font-medium text-lg shadow-lg hover:bg-[#F8A13E]/90 transition-colors">
                Calorie Intake
              </button>
            </div>

            {/* Buttons - Second Row */}
            <div className="grid grid-cols-2 gap-6">
              <button className="bg-[#F8A13E] text-white py-3 rounded-full font-medium text-lg shadow-lg hover:bg-[#F8A13E]/90 transition-colors">
                Days until rest
              </button>
              <button className="bg-[#F8A13E] text-white py-3 rounded-full font-medium text-lg shadow-lg hover:bg-[#F8A13E]/90 transition-colors">
                Calories Burnt
              </button>
            </div>

            {/* AI Recommendations Section */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">AI recommendations</h2>
              <div className="bg-gradient-to-r from-[#F8A13E] to-[#01B1E3] rounded-xl p-4 shadow-lg">
                <p className="text-white text-center py-6">
                  Example of AI recommending what the user can do next, as in what can benefit them.
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Column for Progress of Goals - Full Height */}
          <div className="bg-gradient-to-br from-[#F8A13E] to-[#01B1E3] rounded-xl p-6 shadow-lg h-full">
            <div className="flex items-center justify-center h-full">
              <p className="text-white text-center">
                This box will include every goal the user makes that will each have their own progress bar of completion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessPlanner;