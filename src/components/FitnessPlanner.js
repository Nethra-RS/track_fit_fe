import React, { useState, useEffect } from "react";
import Background from "./Background";
import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";

const FitnessPlanner = () => {
  const [selectedGoals, setSelectedGoals] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleGoal = (index) => {
    const newSelectedGoals = [...selectedGoals];
    newSelectedGoals[index] = !newSelectedGoals[index];
    setSelectedGoals(newSelectedGoals);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Make sure this matches the width in Sidebar.js and Background.js
  const sidebarWidth = isMobile ? 0 : 256;
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen font-ubuntu flex relative">
      {/* Background Component */}
      <Background sidebarWidth={sidebarWidth} />
      
      {/* Mobile Header - Only visible on mobile */}
      {isMobile && <MobileHeader toggleSidebar={toggleSidebar} />}
      
      {/* Sidebar Component - Pass the show state and toggle function */}
      <Sidebar show={showSidebar} handleClose={() => setShowSidebar(false)} />

      {/* Content Wrapper */}
      <div
        className="flex-grow flex flex-col px-3 px-md-4 overflow-auto relative z-10"
        style={{ 
          marginLeft: isMobile ? '0' : `${sidebarWidth}px`, 
          marginTop: '64px', // This should match the navbar height in Background.js
          paddingBottom: '32px',
          transition: 'margin-left 0.3s ease-in-out'
        }}
      >
        <h1 className="text-3xl font-bold text-white mb-6 mt-4">Fitness Planner</h1>

        {/* Desktop Layout */}
        {!isMobile && (
          <div className="grid grid-cols-3 gap-6 flex-grow">
            {/* Left Column (Easy Checklist & Calendar) */}
            <div className="col-span-2 space-y-6 flex flex-col">
              <div className="grid grid-cols-2 gap-6">
                {/* Easy Checklist */}
                <div className="flex flex-col flex-1">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Easy Checklist
                  </h2>
                  <div className="bg-gradient-to-br from-[#F8A13E] to-[#01B1E3] rounded-xl p-6 shadow-lg h-full flex flex-col">
                    <div className="space-y-3 flex-grow">
                      {[
                        "Today's Goal 1",
                        "Today's Goal 2",
                        "Today's Goal 3",
                        "Today's Goal 4",
                      ].map((goal, index) => (
                        <div
                          key={index}
                          className="flex items-center text-lg font-bold rounded-lg"
                        >
                          <input
                            type="checkbox"
                            checked={selectedGoals[index]}
                            onChange={() => toggleGoal(index)}
                            className="mr-3 h-5 w-5 accent-orange-400"
                          />
                          <span className="text-white">{goal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Calendar */}
                <div className="flex flex-col flex-1">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Calendar
                  </h2>
                  <div className="bg-white rounded-lg p-6 text-gray-800 shadow-lg h-full flex flex-col">
                    <div className="flex justify-end mb-2">
                      <div className="text-right">
                        <div className="text-xs font-medium text-gray-500">
                          2025
                        </div>
                        <div
                          className="text-xl font-medium italic"
                          style={{ fontFamily: "cursive" }}
                        >
                          January
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                        <div
                          key={index}
                          className="text-center font-medium text-sm"
                        >
                          {day}
                        </div>
                      ))}
                      {calendarDays.map((day) => (
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

              {/* Buttons Row */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button className="bg-[#F8A13E] text-white py-3 rounded-full font-medium shadow-lg hover:bg-[#F8A13E]/90 transition">
                    User BMI
                  </button>
                  <button className="bg-[#F8A13E] text-white py-3 rounded-full font-medium shadow-lg hover:bg-[#F8A13E]/90 transition">
                    Calorie Intake
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button className="bg-[#F8A13E] text-white py-3 rounded-full font-medium shadow-lg hover:bg-[#F8A13E]/90 transition">
                    Days until rest
                  </button>
                  <button className="bg-[#F8A13E] text-white py-3 rounded-full font-medium shadow-lg hover:bg-[#F8A13E]/90 transition">
                    Calories Burnt
                  </button>
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="relative mt-4">
                <h2 className="text-xl font-semibold text-white mb-4">
                  AI Recommendations
                </h2>
                <div className="bg-gradient-to-r from-[#F8A13E] to-[#01B1E3] rounded-xl p-6 shadow-lg">
                  <p className="text-white text-center py-6">
                    Example of AI recommending what the user can do next.
                  </p>
                </div>
              </div>
            </div>

            {/* Progress of Goals */}
            <div className="relative row-span-2 flex flex-col h-full">
              <h2 className="text-xl font-semibold text-white mb-4">
                Progress of Goals
              </h2>
              <div className="bg-gradient-to-br from-[#F8A13E] to-[#01B1E3] rounded-xl p-6 w-full shadow-lg flex flex-col flex-grow">
                <div className="flex-grow flex items-center justify-center">
                  <p className="text-white text-center">
                    This box will include every goal the user makes with progress
                    bars.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Layout */}
        {isMobile && (
          <div className="flex flex-col space-y-6">
            {/* Easy Checklist */}
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold text-white mb-4">
                Easy Checklist
              </h2>
              <div className="bg-gradient-to-br from-[#F8A13E] to-[#01B1E3] rounded-xl p-6 shadow-lg flex flex-col">
                <div className="space-y-3">
                  {[
                    "Today's Goal 1",
                    "Today's Goal 2",
                    "Today's Goal 3",
                    "Today's Goal 4",
                  ].map((goal, index) => (
                    <div
                      key={index}
                      className="flex items-center text-lg font-bold rounded-lg"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGoals[index]}
                        onChange={() => toggleGoal(index)}
                        className="mr-3 h-5 w-5 accent-orange-400"
                      />
                      <span className="text-white">{goal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold text-white mb-4">
                Calendar
              </h2>
              <div className="bg-white rounded-lg p-6 text-gray-800 shadow-lg flex flex-col">
                <div className="flex justify-end mb-2">
                  <div className="text-right">
                    <div className="text-xs font-medium text-gray-500">
                      2025
                    </div>
                    <div
                      className="text-xl font-medium italic"
                      style={{ fontFamily: "cursive" }}
                    >
                      January
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                    <div
                      key={index}
                      className="text-center font-medium text-sm"
                    >
                      {day}
                    </div>
                  ))}
                  {calendarDays.map((day) => (
                    <div key={day} className="text-center p-1">
                      <div className="w-8 h-8 flex items-center justify-center text-sm">
                        {day}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Buttons Section */}
            <div className="space-y-3">
              <button className="bg-[#F8A13E] text-white py-3 rounded-full font-medium shadow-lg hover:bg-[#F8A13E]/90 transition w-full">
                User BMI
              </button>
              <button className="bg-[#F8A13E] text-white py-3 rounded-full font-medium shadow-lg hover:bg-[#F8A13E]/90 transition w-full">
                Calorie Intake
              </button>
              <button className="bg-[#F8A13E] text-white py-3 rounded-full font-medium shadow-lg hover:bg-[#F8A13E]/90 transition w-full">
                Days until rest
              </button>
              <button className="bg-[#F8A13E] text-white py-3 rounded-full font-medium shadow-lg hover:bg-[#F8A13E]/90 transition w-full">
                Calories Burnt
              </button>
            </div>

            {/* AI Recommendations */}
            <div className="relative">
              <h2 className="text-xl font-semibold text-white mb-4">
                AI Recommendations
              </h2>
              <div className="bg-gradient-to-r from-[#F8A13E] to-[#01B1E3] rounded-xl p-6 shadow-lg">
                <p className="text-white text-center py-6">
                  Example of AI recommending what the user can do next.
                </p>
              </div>
            </div>

            {/* Progress of Goals */}
            <div className="relative flex flex-col">
              <h2 className="text-xl font-semibold text-white mb-4">
                Progress of Goals
              </h2>
              <div className="bg-gradient-to-br from-[#F8A13E] to-[#01B1E3] rounded-xl p-6 shadow-lg">
                <div className="py-6">
                  <p className="text-white text-center">
                    This box will include every goal the user makes with progress
                    bars.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FitnessPlanner;