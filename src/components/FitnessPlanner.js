import React, { useState, useEffect } from "react";
import Background from "./Background";
import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";

const FitnessPlanner = () => {
  // State variables
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [goals, setGoals] = useState([]);
  const [todayGoals, setTodayGoals] = useState([]);
  const [activeGoals, setActiveGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Responsive state
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  // Fetch goals on component mount and when selected date changes
  useEffect(() => {
    fetchGoalsForDate(selectedDate);
    fetchActiveGoals();
  }, [selectedDate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch goals for the selected date
  const fetchGoalsForDate = async (date) => {
    setIsLoading(true);
    try {
      const day = date.getDate();
      const month = date.getMonth() + 1; // JavaScript months are 0-indexed
      const year = date.getFullYear();
      
      const response = await fetch(
        `http://localhost:3000/api/goals?active=true&date=${day}&month=${month}&year=${year}`
      );
      
      if (!response.ok) throw new Error("Failed to fetch goals");
      
      const data = await response.json();
      setTodayGoals(data.goals || []);
    } catch (error) {
      console.error("Error fetching goals:", error);
      setTodayGoals([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch active goals for the current month
  const fetchActiveGoals = async () => {
    setIsLoading(true);
    try {
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();
      
      const response = await fetch(
        `http://localhost:3000/api/goals?active=true&month=${month}&year=${year}`
      );
      
      if (!response.ok) throw new Error("Failed to fetch active goals");
      
      const data = await response.json();
      setActiveGoals(data.goals || []);
    } catch (error) {
      console.error("Error fetching active goals:", error);
      setActiveGoals([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle date selection from calendar
  const handleDateClick = (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
  };

  // Calculate progress percentage for a goal
  const calculateProgress = (goal) => {
    if (!goal.metrics || goal.metrics.length === 0) return 0;
    
    // Calculate average progress across all metrics
    let totalProgress = 0;
    
    goal.metrics.forEach(metric => {
      const current = metric.current;
      const target = metric.target;
      
      // Simple progress calculation - can be refined based on goal type
      let metricProgress = (current / target) * 100;
      
      // Cap at 100%
      metricProgress = Math.min(metricProgress, 100);
      
      totalProgress += metricProgress;
    });
    
    return Math.round(totalProgress / goal.metrics.length);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Format date for display
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  // Calendar generation
  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Create array for the days of the month
    const calendarDays = Array(daysInMonth).fill().map((_, i) => i + 1);
    
    // Add empty cells for days before the first of the month
    const emptyCells = Array(firstDay).fill(null);
    
    return [...emptyCells, ...calendarDays];
  };

  // Make sure this matches the width in Sidebar.js and Background.js
  const sidebarWidth = isMobile ? 0 : 256;

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
        
        {/* Selected Date Display */}
        <div className="text-xl font-medium text-white mb-4">
          {formatDate(selectedDate)}
        </div>

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
                    {isLoading ? (
                      <p className="text-white text-center">Loading goals...</p>
                    ) : todayGoals.length > 0 ? (
                      <div className="space-y-3 flex-grow">
                        {todayGoals.map((goal, index) => (
                          <div key={index} className="flex items-center text-lg rounded-lg">
                            <input
                              type="checkbox"
                              className="mr-3 h-5 w-5 accent-orange-400"
                            />
                            <span className="text-white font-bold">{goal.goal_name}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white text-center">No goals for this date.</p>
                    )}
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
                          {currentMonth.getFullYear()}
                        </div>
                        <div
                          className="text-xl font-medium italic"
                          style={{ fontFamily: "cursive" }}
                        >
                          {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentMonth)}
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
                      {generateCalendar().map((day, index) => (
                        <div key={index} className="text-center p-1">
                          {day ? (
                            <button
                              onClick={() => handleDateClick(day)}
                              className={`w-8 h-8 flex items-center justify-center text-sm rounded-full ${
                                selectedDate.getDate() === day && 
                                selectedDate.getMonth() === currentMonth.getMonth() && 
                                selectedDate.getFullYear() === currentMonth.getFullYear()
                                  ? 'bg-[#F8A13E] text-white'
                                  : day === new Date().getDate() && 
                                    currentMonth.getMonth() === new Date().getMonth() && 
                                    currentMonth.getFullYear() === new Date().getFullYear()
                                    ? 'border border-[#F8A13E]'
                                    : ''
                              }`}
                            >
                              {day}
                            </button>
                          ) : (
                            <div className="w-8 h-8"></div>
                          )}
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
                    {isLoading ? "Generating recommendations..." : 
                      "Based on your current progress, we recommend focusing on your endurance goals this week."}
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
                {isLoading ? (
                  <div className="flex-grow flex items-center justify-center">
                    <p className="text-white text-center">Loading goals...</p>
                  </div>
                ) : activeGoals.length > 0 ? (
                  <div className="flex-grow flex flex-col space-y-6">
                    {activeGoals.map((goal, index) => (
                      <div key={index} className="flex flex-col">
                        <div className="flex justify-between text-white mb-1">
                          <span className="font-bold">{goal.goal_name}</span>
                          <span>{calculateProgress(goal)}%</span>
                        </div>
                        <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                          <div 
                            className="bg-white h-2 rounded-full" 
                            style={{ width: `${calculateProgress(goal)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-grow flex items-center justify-center">
                    <p className="text-white text-center">
                      No active goals for this month.
                    </p>
                  </div>
                )}
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
                {isLoading ? (
                  <p className="text-white text-center">Loading goals...</p>
                ) : todayGoals.length > 0 ? (
                  <div className="space-y-3">
                    {todayGoals.map((goal, index) => (
                      <div key={index} className="flex items-center text-lg rounded-lg">
                        <input
                          type="checkbox"
                          className="mr-3 h-5 w-5 accent-orange-400"
                        />
                        <span className="text-white font-bold">{goal.goal_name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white text-center">No goals for this date.</p>
                )}
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
                      {currentMonth.getFullYear()}
                    </div>
                    <div
                      className="text-xl font-medium italic"
                      style={{ fontFamily: "cursive" }}
                    >
                      {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentMonth)}
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
                  {generateCalendar().map((day, index) => (
                    <div key={index} className="text-center p-1">
                      {day ? (
                        <button
                          onClick={() => handleDateClick(day)}
                          className={`w-8 h-8 flex items-center justify-center text-sm rounded-full ${
                            selectedDate.getDate() === day && 
                            selectedDate.getMonth() === currentMonth.getMonth() && 
                            selectedDate.getFullYear() === currentMonth.getFullYear()
                              ? 'bg-[#F8A13E] text-white'
                              : day === new Date().getDate() && 
                                currentMonth.getMonth() === new Date().getMonth() && 
                                currentMonth.getFullYear() === new Date().getFullYear()
                                ? 'border border-[#F8A13E]'
                                : ''
                          }`}
                        >
                          {day}
                        </button>
                      ) : (
                        <div className="w-8 h-8"></div>
                      )}
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
                  {isLoading ? "Generating recommendations..." : 
                    "Based on your current progress, we recommend focusing on your endurance goals this week."}
                </p>
              </div>
            </div>

            {/* Progress of Goals */}
            <div className="relative flex flex-col">
              <h2 className="text-xl font-semibold text-white mb-4">
                Progress of Goals
              </h2>
              <div className="bg-gradient-to-br from-[#F8A13E] to-[#01B1E3] rounded-xl p-6 shadow-lg">
                {isLoading ? (
                  <div className="py-6">
                    <p className="text-white text-center">Loading goals...</p>
                  </div>
                ) : activeGoals.length > 0 ? (
                  <div className="space-y-4">
                    {activeGoals.map((goal, index) => (
                      <div key={index} className="flex flex-col">
                        <div className="flex justify-between text-white mb-1">
                          <span className="font-bold">{goal.goal_name}</span>
                          <span>{calculateProgress(goal)}%</span>
                        </div>
                        <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                          <div 
                            className="bg-white h-2 rounded-full" 
                            style={{ width: `${calculateProgress(goal)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6">
                    <p className="text-white text-center">
                      No active goals for this month.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FitnessPlanner;