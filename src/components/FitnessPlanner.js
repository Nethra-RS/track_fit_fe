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
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const sidebarWidth = 256;

  // Handle mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleGoal = (index) => {
    const newSelectedGoals = [...selectedGoals];
    newSelectedGoals[index] = !newSelectedGoals[index];
    setSelectedGoals(newSelectedGoals);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen">
      {/* Mobile Header - only shown on mobile */}
      {isMobile && <MobileHeader toggleSidebar={toggleSidebar} />}
      <Sidebar show={showSidebar} handleClose={() => setShowSidebar(false)} />
      <Background sidebarWidth={sidebarWidth} />

      {/* Content Wrapper */}
      <div
        className={`relative pb-12 ${isMobile ? "px-4 pt-20" : "px-8 pt-24"}`}
        style={{
          marginLeft: isMobile ? "0" : `${sidebarWidth}px`,
          width: isMobile ? "100%" : `calc(100% - ${sidebarWidth}px)`,
        }}
      >
        <h1 className="text-3xl font-bold text-white mb-10">Fitness Planner</h1>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow ">
          {/* Left Column (Easy Checklist & Calendar) */}
          <div className="col-span-2 space-y-10 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 m-4 gap-8">
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
            <div className="space-y-4 mt-4 m-4 gap-6">
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
            <div className="relative mt-8 m-4">
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
          <div className="relative lg:row-span-2 flex flex-col h-full pb-4 m-8 w-full lg:w-auto m-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              Progress of Goals
            </h2>
            <div className="bg-gradient-to-br from-[#F8A13E] to-[#01B1E3] mr-6 rounded-xl p-6 w-full shadow-lg flex flex-col flex-grow">
              <div className="flex-grow flex items-center justify-center">
                <p className="text-white text-center">
                  This box will include every goal the user makes with progress
                  bars.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessPlanner;
