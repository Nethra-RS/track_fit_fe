import React, { useState, useEffect } from "react";
import Background from "./Background";
import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";
import { format } from "date-fns";
import API_BASE_URL from "../lib/api";

const FitnessPlanner = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [todayGoals, setTodayGoals] = useState([]);
  const [activeGoals, setActiveGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    fetchGoalsForDate(selectedDate);
    fetchActiveGoals();
  }, [selectedDate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchGoalsForDate = async (date) => {
    setIsLoading(true);
    try {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const response = await fetch(`${API_BASE_URL}/api/goals?active=true&date=${day}&month=${month}&year=${year}`, {
        credentials: "include",
      });
      const data = await response.json();
      setTodayGoals(data.goals || []);
    } catch (error) {
      console.error("Failed to fetch daily goals", error);
      setTodayGoals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActiveGoals = async () => {
    setIsLoading(true);
    try {
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();
      const response = await fetch(`${API_BASE_URL}/api/goals?active=true&month=${month}&year=${year}`, {
        credentials: "include",
      });
      const data = await response.json();
      const enrichedGoals = await Promise.all(
        (data.goals || []).map(async (goal) => {
          try {
            const res = await fetch(`${API_BASE_URL}/api/goals/progress?goal_id=${goal.goal_id}`, {
              credentials: "include",
            });
            const progressData = await res.json();
            return {
              ...goal,
              overall_progress: progressData?.summary?.overall_progress || 0,
            };
          } catch {
            return { ...goal, overall_progress: 0 };
          }
        })
      );
      setActiveGoals(enrichedGoals);
    } catch (error) {
      console.error("Failed to fetch active goals", error);
      setActiveGoals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProgress = (goal) => goal.overall_progress || 0;
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const formatDate = (date) => new Intl.DateTimeFormat("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(date);
  const sidebarWidth = isMobile ? 0 : 256;

  const handleDateClick = (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
  };

  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendarDays = Array(daysInMonth).fill().map((_, i) => i + 1);
    const emptyCells = Array(firstDay).fill(null);
    return [...emptyCells, ...calendarDays];
  };

  return (
    <div className="min-h-screen font-ubuntu flex relative">
      <Background sidebarWidth={sidebarWidth} />
      {isMobile && <MobileHeader toggleSidebar={toggleSidebar} />}
      <Sidebar show={showSidebar} handleClose={() => setShowSidebar(false)} />
      <div
        className="flex-grow flex flex-col px-3 px-md-4 overflow-auto relative z-10"
        style={{
          marginLeft: isMobile ? "0" : `${sidebarWidth}px`,
          marginTop: "64px",
          paddingBottom: "32px",
          transition: "margin-left 0.3s ease-in-out",
        }}
      >
        <h1 className="text-3xl font-bold text-white mb-6 mt-4">Fitness Planner</h1>
        <div className="text-xl font-medium text-white mb-4">{formatDate(selectedDate)}</div>

        {/* Layout Switch */}
        {!isMobile ? (
          <div className="grid grid-cols-3 gap-6">
            {/* Left column: Checklist & Calendar */}
            <div className="col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Checklist */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Easy Checklist</h2>
                  <div className="bg-gradient-to-br from-[#F8A13E] to-[#01B1E3] p-6 rounded-xl shadow-lg">
                    {isLoading ? (
                      <p className="text-white text-center">Loading goals...</p>
                    ) : todayGoals.length > 0 ? (
                      todayGoals.map((goal, index) => (
                        <div key={index} className="flex items-center text-lg">
                          <input type="checkbox" className="mr-3 h-5 w-5 accent-orange-400" />
                          <span className="text-white font-bold">{goal.goal_name}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-white text-center">No goals for this date.</p>
                    )}
                  </div>
                </div>
                {/* Calendar */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Calendar</h2>
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                        <div key={i} className="font-medium text-sm">{d}</div>
                      ))}
                      {generateCalendar().map((day, i) => (
                        <div key={i} className="p-1">
                          {day ? (
                            <button
                              onClick={() => handleDateClick(day)}
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                                selectedDate.getDate() === day &&
                                selectedDate.getMonth() === currentMonth.getMonth() &&
                                selectedDate.getFullYear() === currentMonth.getFullYear()
                                  ? 'bg-[#F8A13E] text-white'
                                  : 'hover:bg-gray-200'
                              }`}
                            >
                              {day}
                            </button>
                          ) : <div className="w-8 h-8" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-[#F8A13E] text-white py-3 rounded-full">User BMI</button>
                <button className="bg-[#F8A13E] text-white py-3 rounded-full">Calorie Intake</button>
                <button className="bg-[#F8A13E] text-white py-3 rounded-full">Days Until Rest</button>
                <button className="bg-[#F8A13E] text-white py-3 rounded-full">Calories Burnt</button>
              </div>
              {/* AI Recommendations */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">AI Recommendations</h2>
                <div className="bg-gradient-to-r from-[#F8A13E] to-[#01B1E3] p-6 rounded-xl">
                  <p className="text-white text-center">
                    {isLoading ? "Generating recommendations..." :
                      "Based on your current progress, we recommend focusing on your endurance goals this week."}
                  </p>
                </div>
              </div>
            </div>
            {/* Right column: Progress */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Progress of Goals</h2>
              <div className="bg-gradient-to-br from-[#F8A13E] to-[#01B1E3] p-6 rounded-xl shadow-lg space-y-4">
                {isLoading ? (
                  <p className="text-white text-center">Loading progress...</p>
                ) : activeGoals.length > 0 ? (
                  activeGoals.map((goal, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-white font-bold mb-1">
                        <span>{goal.goal_name}</span>
                        <span>{calculateProgress(goal)}%</span>
                      </div>
                      <div className="w-full h-2 bg-white bg-opacity-30 rounded-full">
                        <div
                          className="h-2 bg-white rounded-full"
                          style={{ width: `${calculateProgress(goal)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-white text-center">No active goals for this month.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile layout reuse */}
            <div className="space-y-6">
              {/* Checklist */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Easy Checklist</h2>
                <div className="bg-gradient-to-br from-[#F8A13E] to-[#01B1E3] p-6 rounded-xl shadow-lg">
                  {isLoading ? (
                    <p className="text-white text-center">Loading goals...</p>
                  ) : todayGoals.length > 0 ? (
                    todayGoals.map((goal, index) => (
                      <div key={index} className="flex items-center text-lg">
                        <input type="checkbox" className="mr-3 h-5 w-5 accent-orange-400" />
                        <span className="text-white font-bold">{goal.goal_name}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-white text-center">No goals for this date.</p>
                  )}
                </div>
              </div>
              {/* Progress */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Progress of Goals</h2>
                <div className="bg-gradient-to-br from-[#F8A13E] to-[#01B1E3] p-6 rounded-xl shadow-lg">
                  {isLoading ? (
                    <p className="text-white text-center">Loading progress...</p>
                  ) : activeGoals.length > 0 ? (
                    activeGoals.map((goal, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex justify-between text-white font-bold mb-1">
                          <span>{goal.goal_name}</span>
                          <span>{calculateProgress(goal)}%</span>
                        </div>
                        <div className="w-full h-2 bg-white bg-opacity-30 rounded-full">
                          <div
                            className="h-2 bg-white rounded-full"
                            style={{ width: `${calculateProgress(goal)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-white text-center">No active goals for this month.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FitnessPlanner;