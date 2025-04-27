import React, { useState, useEffect } from "react";
import Background from "./Background";
import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";
import { format, addMonths, subMonths } from "date-fns";
import API_BASE_URL from "../lib/api";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

const FitnessPlanner = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [todayGoals, setTodayGoals] = useState([]);
  const [activeGoals, setActiveGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  
  // Progress logs state to track logged progress for the selected date
  const [progressLogs, setProgressLogs] = useState({});
  
  // AI recommendations state
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [recommendationError, setRecommendationError] = useState(null);
  
  // Modal state variables
  const [showBmiModal, setShowBmiModal] = useState(false);
  const [showCaloriesModal, setShowCaloriesModal] = useState(false);
  const [showStepsModal, setShowStepsModal] = useState(false);
  const [showHeartRateModal, setShowHeartRateModal] = useState(false);
  
  // BMI calculator state
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);
  const [loadingBmiData, setLoadingBmiData] = useState(false);
  
  // Google Fit data
  const [fitData, setFitData] = useState(null);
  const [fitDataLoading, setFitDataLoading] = useState(true);
  const [currentStats, setCurrentStats] = useState({
    steps: 0,
    distance: 0,
    calories: 0,
    'heart points': 0,
    'heart rate': 0,
  });
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    fetchGoalsForDate(selectedDate);
    fetchActiveGoals();
    fetchGoogleFitData();
    fetchUserBmiData();
    fetchAiRecommendations();
  }, [selectedDate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (fitData) {
      updateStatsForSelectedDate();
    }
  }, [selectedDate, fitData]);

  // Fetch progress logs for all goals on selected date
  const fetchProgressLogsForDate = async (date) => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const promises = activeGoals.map(async (goal) => {
        const response = await fetch(`${API_BASE_URL}/api/goals/progress?goal_id=${goal.goal_id}`, {
          credentials: "include",
        });
        
        if (!response.ok) return null;
        
        const data = await response.json();
        
        // Check if there's progress logged for this specific date
        const hasProgressForDate = data.progress.some(p => {
          const progressDate = new Date(p.created_at);
          return progressDate.toDateString() === date.toDateString();
        });
        
        return {
          goalId: goal.goal_id,
          hasProgressForDate,
          status: data.summary?.status || 'not_started',
          description: goal.goal_description || '', // Include description
          progressDetails: data.progress || [] // Include progress details
        };
      });
      
      const results = await Promise.all(promises);
      const logs = {};
      
      results.forEach(result => {
        if (result) {
          logs[result.goalId] = {
            hasProgressForDate: result.hasProgressForDate,
            status: result.status,
            description: result.description,
            progressDetails: result.progressDetails
          };
        }
      });
      
      setProgressLogs(logs);
    } catch (error) {
      console.error("Failed to fetch progress logs", error);
    }
  };

  // Update fetchGoalsForDate to include all goals between start and end dates
  const fetchGoalsForDate = async (date) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/goals?active=true`, {
        credentials: "include",
      });
      const data = await response.json();
      
      // Filter goals based on date (only those where selected date is between start and end date)
      const goalsForDate = (data.goals || []).filter(goal => {
        const startDate = new Date(goal.start_date);
        const endDate = new Date(goal.end_date);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        
        const targetDate = new Date(date);
        targetDate.setHours(12, 0, 0, 0);
        
        return targetDate >= startDate && targetDate <= endDate;
      });
      
      // Initialize all goals as not completed
      const goalsWithCompletionStatus = goalsForDate.map(goal => ({
        ...goal,
        completed: false
      }));
      
      setTodayGoals(goalsWithCompletionStatus);
      
      // After fetching goals, fetch progress logs for those goals
      await fetchProgressLogsForDate(date);
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
              status: progressData?.summary?.status || 'not_started'
            };
          } catch {
            return { ...goal, overall_progress: 0, status: 'not_started' };
          }
        })
      );
      setActiveGoals(enrichedGoals);
      
      // After fetching active goals, update progress logs
      await fetchProgressLogsForDate(selectedDate);
    } catch (error) {
      console.error("Failed to fetch active goals", error);
      setActiveGoals([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Modified to log progress for the selected date
  const logDailyProgress = async (goalId) => {
    try {
      // Get the metrics for this goal
      const goal = activeGoals.find(g => g.goal_id === goalId);
      if (!goal) return;
      
      // Create a simple progress entry with dummy data
      // In a real implementation, you would show a form to collect actual values
      const metrics = goal.metrics.map(metric => ({
        metric_id: metric.metric_id,
        metric_val: 1 // Just a dummy value to log progress
      }));
      
      const response = await fetch(`${API_BASE_URL}/api/goals/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          goal_id: goalId,
          metrics
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to log progress');
      }
      
      // Update local state to show the progress immediately
      setProgressLogs(prevLogs => ({
        ...prevLogs,
        [goalId]: {
          ...(prevLogs[goalId] || {}),
          hasProgressForDate: true,
          description: goal.goal_description || '',
          progressDetails: [...((prevLogs[goalId]?.progressDetails || [])), {
            created_at: new Date().toISOString(),
            values: metrics
          }]
        }
      }));
      
      // Refresh active goals to update progress
      fetchActiveGoals();
    } catch (error) {
      console.error('Error logging progress:', error);
    }
  };
  
  // Toggle goal completion status (now used for logging progress for the day)
  const toggleGoalCompletion = async (goalId, isCompleted) => {
    // If trying to mark as completed, log progress
    if (isCompleted) {
      await logDailyProgress(goalId);
    } else {
      // Implement logic to delete progress for this date if needed
      console.log("Deleting progress is not implemented yet");
    }
  };

  // Update todayGoals when progressLogs or activeGoals changes
  useEffect(() => {
    if (Object.keys(progressLogs).length > 0 && todayGoals.length > 0) {
      const updatedTodayGoals = todayGoals.map(todayGoal => {
        const progressLog = progressLogs[todayGoal.goal_id];
        
        // Mark as completed if progress is logged for this date OR status is completed
        const completed = progressLog?.hasProgressForDate || progressLog?.status === 'completed';
        
        return { 
          ...todayGoal, 
          completed,
          progressDetails: progressLog?.progressDetails || [],
          description: progressLog?.description || todayGoal.goal_description || ''
        };
      });
      
      // Only update if there's any difference
      if (JSON.stringify(updatedTodayGoals) !== JSON.stringify(todayGoals)) {
        setTodayGoals(updatedTodayGoals);
      }
    }
  }, [progressLogs, todayGoals]);

  // Fetch AI recommendations from API
  const fetchAiRecommendations = async () => {
    setLoadingRecommendations(true);
    setRecommendationError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/recommendations/fetch`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recommendations: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('AI Recommendations data:', data);
      
      if (data && data.ai_recommendations && Array.isArray(data.ai_recommendations)) {
        setAiRecommendations(data.ai_recommendations);
      } else {
        setAiRecommendations([]);
      }
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      setRecommendationError(error.message);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const fetchUserBmiData = async () => {
    setLoadingBmiData(true);
    try {
      // Fetch user's height and weight from database
      const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.height) setHeight(data.height);
        if (data.weight) setWeight(data.weight);
        
        // Calculate BMI if both values exist
        if (data.height && data.weight) {
          calculateBMI(data.height, data.weight);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user BMI data", error);
    } finally {
      setLoadingBmiData(false);
    }
  };

  const fetchGoogleFitData = async () => {
    try {
      setFitDataLoading(true);
      setFetchError(null);
      
      // Use relative URL for better compatibility across environments
      const apiUrl = `${API_BASE_URL}/api/google-fit/fetch-data`;
      console.log('Fetching data from:', apiUrl);
      
      const res = await fetch(apiUrl, {
        credentials: 'include',
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to fetch stats: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('API Response:', data);
      
      if (!data.fit_data || !Array.isArray(data.fit_data)) {
        console.error('Invalid fit_data structure:', data);
        throw new Error('Invalid data structure returned from API');
      }
      
      setFitData(data.fit_data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setFetchError(err.message);
    } finally {
      setFitDataLoading(false);
    }
  };

  const updateStatsForSelectedDate = () => {
    if (!fitData || !Array.isArray(fitData)) {
      console.log('No fitData available or not an array:', fitData);
      return;
    }

    console.log('Processing fitData for selected date:', selectedDate.toDateString());
    
    // Initialize new stats object
    const dayStats = {
      steps: 0,
      distance: 0,
      calories: 0,
      'heart points': 0,
      'heart rate': 75, // Default value for heart rate (usually would come from a separate API call)
    };
    
    // Format date ranges for comparison
    const dayStart = new Date(selectedDate).setHours(0, 0, 0, 0);
    const dayEnd = new Date(selectedDate).setHours(23, 59, 59, 999);
    
    // For each metric, get the values for the selected date
    fitData.forEach(metric => {
      const name = metric.name;
      if (!dayStats.hasOwnProperty(name)) {
        console.log(`Skipping unknown metric: ${name}`);
        return;
      }
      
      console.log(`Processing metric: ${name}`);
      
      // Look for matching data points
      Object.entries(metric.metrics || {}).forEach(([dateStr, data]) => {
        const dataTimestamp = data.timestamp;
        
        if (dataTimestamp >= dayStart && dataTimestamp <= dayEnd) {
          dayStats[name] = data.value;
          console.log(`Found data for ${name} on ${dateStr}: ${data.value}`);
        }
      });
    });
    
    console.log('Final day stats:', dayStats);
    setCurrentStats(dayStats);
  };
  
  // BMI calculation function
  const calculateBMI = (heightValue = height, weightValue = weight) => {
    if (heightValue && weightValue) {
      const heightInMeters = parseFloat(heightValue) / 100;
      const weightInKg = parseFloat(weightValue) * 0.453592;
      const bmi = (parseFloat(weightInKg) / (heightInMeters * heightInMeters)).toFixed(2);
      setBmiResult(bmi);
      return bmi;
    }
    return null;
  };
  
  const saveBmiData = async (height, weight) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ height, weight })
      });
      
      if (!response.ok) {
        console.error('Failed to save BMI data');
      }
    } catch (error) {
      console.error('Error saving BMI data:', error);
    }
  };

  const calculateProgress = (goal) => goal.overall_progress || 0;
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const formatDate = (date) => new Intl.DateTimeFormat("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(date);
  const sidebarWidth = isMobile ? 0 : 256;

  // Format number with 2 decimal places
  const formatDecimal = (num) => {
    return parseFloat(num).toFixed(2);
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
  };

  // Navigate to previous month
  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Navigate to next month
  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Calendar section with month display fix
  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendarDays = Array(daysInMonth).fill().map((_, i) => i + 1);
    const emptyCells = Array(firstDay).fill(null);
    return [...emptyCells, ...calendarDays];
  };

  // Month names for display
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Function to handle retry fetching data
  const handleRetryFetch = () => {
    if (fetchError?.includes("403")) {
      window.location.href = `${API_BASE_URL}/api/google-fit/authorize`;
    } else {
      fetchGoogleFitData(); // Retry fetch
    }
  };

  const handleRetryRecommendations = () => {
    fetchAiRecommendations();
  };

  // Function to render a random recommendation from the array
  const renderRandomRecommendation = () => {
    if (aiRecommendations.length === 0) {
      return "No recommendations available at this time.";
    }
    
    // Get a random recommendation from the array
    const randomIndex = Math.floor(Math.random() * aiRecommendations.length);
    return aiRecommendations[randomIndex];
  };

  // Modified BMI Modal render function
  const renderBmiModal = () => {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">BMI Information</h2>
          {loadingBmiData ? (
            <div className="flex justify-center py-4">
              <Spinner animation="border" />
            </div>
          ) : (
            <div className="space-y-4">
              {height && weight ? (
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <div className="text-xl font-bold text-gray-800 mb-2">
                    Your Current Data
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-medium">Height:</span>
                    <span className="text-gray-900">{formatDecimal(height)} cm</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-700 font-medium">Weight:</span>
                    <span className="text-gray-900">{formatDecimal(weight)} kg</span>
                  </div>
                  <div className="text-3xl font-bold text-[#F8A13E] mb-1">
                    BMI: {bmiResult}
                  </div>
                  <div className="text-md text-gray-700">
                    {parseFloat(bmiResult) < 18.5 ? 'Underweight' :
                    parseFloat(bmiResult) < 25 ? 'Normal weight' :
                    parseFloat(bmiResult) < 30 ? 'Overweight' : 'Obese'}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 p-4 rounded-lg text-center mb-4">
                  <p className="text-gray-700">
                    No BMI data found. Please ensure your height and weight are saved in your profile.
                  </p>
                </div>
              )}
              <button
                onClick={() => setShowBmiModal(false)}
                className="w-full py-2 bg-gray-300 text-gray-800 rounded-full font-medium"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    );
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
                      todayGoals.map((goal, index) => {
                        // Check if progress is logged for today
                        const progressLog = progressLogs[goal.goal_id];
                        const hasLoggedProgress = progressLog?.hasProgressForDate;
                        const isCompleted = progressLog?.status === 'completed';
                        
                        return (
                          <div key={index} className="mb-3">
                            <div className="flex items-center text-lg">
                              <input 
                                type="checkbox" 
                                className="mr-3 h-5 w-5 accent-orange-400" 
                                checked={hasLoggedProgress} // Remove the "|| isCompleted" condition
                                onChange={(e) => toggleGoalCompletion(goal.goal_id, e.target.checked)}
                              />
                              <span className="text-white font-bold">{goal.goal_name}</span>
                            </div>
                           
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-white text-center">No goals for this date.</p>
                    )}
                  </div>
                </div>
                {/* Calendar */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Calendar</h2>
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="text-center mb-4 flex items-center justify-between">
                      <button 
                        onClick={handlePreviousMonth}
                        className="text-gray-600 hover:text-gray-800 focus:outline-none"
                      >
                        &lt;
                      </button>
                      <div className="text-2xl text-gray-800" style={{ fontFamily: "'Dancing Script', cursive" }}>
                        {monthNames[currentMonth.getMonth()]}
                        <span className="ml-2" style={{ fontFamily: "'Dancing Script', cursive" }}>{currentMonth.getFullYear()}</span>
                      </div>
                      <button 
                        onClick={handleNextMonth}
                        className="text-gray-600 hover:text-gray-800 focus:outline-none"
                      >
                        &gt;
                      </button>
                    </div>
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
                <button 
                  className="bg-[#F8A13E] text-white py-3 rounded-full"
                  onClick={() => setShowBmiModal(true)}
                >
                  User BMI
                </button>
                <button 
                  className="bg-[#F8A13E] text-white py-3 rounded-full"
                  onClick={() => setShowCaloriesModal(true)}
                >
                  Calories
                </button>
                <button 
                  className="bg-[#F8A13E] text-white py-3 rounded-full"
                  onClick={() => setShowHeartRateModal(true)}
                >
                  Heart Rate
                </button>
                <button 
                  className="bg-[#F8A13E] text-white py-3 rounded-full"
                  onClick={() => setShowStepsModal(true)}
                >
                  Steps
                </button>
              </div>

              {/* AI Recommendations */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">AI Recommendations</h2>
                <div className="bg-gradient-to-r from-[#F8A13E] to-[#01B1E3] p-6 rounded-xl">
                  {loadingRecommendations ? (
                    <div className="text-white text-center py-2">
                      <Spinner animation="border" size="sm" className="mr-2" />
                      <span>Loading recommendations...</span>
                    </div>
                  ) : recommendationError ? (
                    <div className="text-white text-center">
                      <p className="mb-2">Error loading recommendations: {recommendationError}</p>
                      <button
                        onClick={handleRetryRecommendations}
                        className="bg-white text-[#F8A13E] py-1 px-4 rounded-full font-medium text-sm"
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <div className="text-white">
                      <div className="mb-2 font-bold">Recommendation:</div>
                      <p>{renderRandomRecommendation()}</p>
                      {aiRecommendations.length > 1 && (
                        <button
                          onClick={() => setAiRecommendations([...aiRecommendations])} // Trigger re-render for new random recommendation
                          className="bg-white text-[#F8A13E] py-1 px-3 rounded-full font-medium text-sm mt-3"
                        >
                          Show Another
                        </button>
                      )}
                    </div>
                  )}
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
                        className="h-2 bg-[#F8A13E] rounded-full" 
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
                    todayGoals.map((goal, index) => {
                      // Check if progress is logged for today
                      const progressLog = progressLogs[goal.goal_id];
                      const hasLoggedProgress = progressLog?.hasProgressForDate;
                      const isCompleted = progressLog?.status === 'completed';
                      
                      return (
                        <div key={index} className="flex items-center text-lg">
                          // In both desktop and mobile views, replace the checkbox input with:
                          <input 
                            type="checkbox" 
                            className="mr-3 h-5 w-5 accent-orange-400" 
                            checked={hasLoggedProgress} // Remove the "|| isCompleted" condition
                            onChange={(e) => toggleGoalCompletion(goal.goal_id, e.target.checked)}
                          />
                          <span className="text-white font-bold">{goal.goal_name}</span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-white text-center">No goals for this date.</p>
                  )}
                </div>
              </div>
              
              {/* Calendar for Mobile */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Calendar</h2>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="text-center mb-4 flex items-center justify-between">
                    <button 
                      onClick={handlePreviousMonth}
                      className="text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                      &lt;
                    </button>
                    <div className="text-2xl text-gray-800" style={{ fontFamily: "'Dancing Script', cursive" }}>
                      {monthNames[currentMonth.getMonth()]}
                      <span className="ml-2" style={{ fontFamily: "'Dancing Script', cursive" }}>{currentMonth.getFullYear()}</span>
                    </div>
                    <button 
                      onClick={handleNextMonth}
                      className="text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                      &gt;
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                      <div key={i} className="font-medium text-sm">{d}</div>
                    ))}
                    {generateCalendar().map((day, i) => (
                      <div key={i} className="p-1">
                        {day ? (
                          <button
                            onClick={() => handleDateClick(day)}
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${
                              selectedDate.getDate() === day &&
                              selectedDate.getMonth() === currentMonth.getMonth() &&
                              selectedDate.getFullYear() === currentMonth.getFullYear()
                                ? 'bg-[#F8A13E] text-white'
                                : 'hover:bg-gray-200'
                            }`}
                          >
                            {day}
                          </button>
                        ) : <div className="w-7 h-7" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* AI Recommendations for Mobile */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">AI Recommendations</h2>
                <div className="bg-gradient-to-r from-[#F8A13E] to-[#01B1E3] p-6 rounded-xl">
                  {loadingRecommendations ? (
                    <div className="text-white text-center py-2">
                      <Spinner animation="border" size="sm" className="mr-2" />
                      <span>Loading recommendations...</span>
                    </div>
                  ) : recommendationError ? (
                    <div className="text-white text-center">
                      <p className="mb-2">Error loading recommendations: {recommendationError}</p>
                      <button
                        onClick={handleRetryRecommendations}
                        className="bg-white text-[#F8A13E] py-1 px-4 rounded-full font-medium text-sm"
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <div className="text-white">
                      <div className="mb-2 font-bold">Recommendation:</div>
                      <p>{renderRandomRecommendation()}</p>
                      {aiRecommendations.length > 1 && (
                        <button
                          onClick={() => setAiRecommendations([...aiRecommendations])} // Trigger re-render for new random recommendation
                          className="bg-white text-[#F8A13E] py-1 px-3 rounded-full font-medium text-sm mt-3"
                        >
                          Show Another
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Buttons for mobile */}
              <div className="grid grid-cols-1 gap-4">
                <button 
                  className="bg-[#F8A13E] text-white py-3 rounded-full"
                  onClick={() => setShowBmiModal(true)}
                >
                  User BMI
                </button>
                <button 
                  className="bg-[#F8A13E] text-white py-3 rounded-full"
                  onClick={() => setShowCaloriesModal(true)}
                >
                  Calories
                </button>
                <button 
                  className="bg-[#F8A13E] text-white py-3 rounded-full"
                  onClick={() => setShowHeartRateModal(true)}
                >
                  Heart Rate
                </button>
                <button 
                  className="bg-[#F8A13E] text-white py-3 rounded-full"
                  onClick={() => setShowStepsModal(true)}
                >
                  Steps
                </button>
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
                          className="h-2 bg-[#F8A13E] rounded-full" 
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

      {/* BMI Modal - Now using the render function */}
      {showBmiModal && renderBmiModal()}

      
      {/* Calories Modal */}
      {showCaloriesModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Calories</h2>
            {fitDataLoading ? (
              <div className="flex justify-center py-4">
                <Spinner animation="border" />
              </div>
            ) : fetchError ? (
              <div className="text-center text-gray-700 mb-4">
                <p className="mb-2">Error loading fitness data: {fetchError}</p>
                <button
                  onClick={handleRetryFetch}
                  className="bg-[#F8A13E] text-white py-2 px-4 rounded-full font-semibold"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-4xl font-bold text-[#F8A13E] mb-2">
                  {currentStats.calories || 0}
                </div>
                <p className="text-gray-600 mb-4">calories burned today</p>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-700">
                    Based on your activity level, you should aim for a total intake of approximately {Math.round((currentStats.calories || 0) + 1500)} calories today.
                  </p>
                </div>
              </div>
            )}
            <button
              onClick={() => setShowCaloriesModal(false)}
              className="mt-6 w-full py-2 bg-gray-300 text-gray-800 rounded-full font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Steps Modal */}
      {showStepsModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Steps</h2>
            {fitDataLoading ? (
              <div className="flex justify-center py-4">
                <Spinner animation="border" />
              </div>
            ) : fetchError ? (
              <div className="text-center text-gray-700 mb-4">
                <p className="mb-2">Error loading fitness data: {fetchError}</p>
                <button
                  onClick={handleRetryFetch}
                  className="bg-[#F8A13E] text-white py-2 px-4 rounded-full font-semibold"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-4xl font-bold text-[#F8A13E] mb-2">
                  {currentStats.steps || 0}
                </div>
                <p className="text-gray-600 mb-4">steps taken today</p>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="w-full bg-gray-300 rounded-full h-4 mb-2">
                    <div 
                      className="bg-[#F8A13E] h-4 rounded-full"
                      style={{ width: `${Math.min(100, (currentStats.steps / 10000) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-700">
                    {currentStats.steps < 10000 ? 
                      `${10000 - currentStats.steps} steps to reach your daily goal` : 
                      'Daily goal achieved! Great job!'}
                  </p>
                </div>
              </div>
            )}
            <button
              onClick={() => setShowStepsModal(false)}
              className="mt-6 w-full py-2 bg-gray-300 text-gray-800 rounded-full font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Heart Rate Modal */}
      {showHeartRateModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Heart Rate</h2>
            {fitDataLoading ? (
              <div className="flex justify-center py-4">
                <Spinner animation="border" />
              </div>
            ) : fetchError ? (
              <div className="text-center text-gray-700 mb-4">
                <p className="mb-2">Error loading fitness data: {fetchError}</p>
                <button
                  onClick={handleRetryFetch}
                  className="bg-[#F8A13E] text-white py-2 px-4 rounded-full font-semibold"
                >
                  Retry
                </button>
              </div>
    
      
            ) : (
              <div className="text-center">
                <div className="text-4xl font-bold text-[#F8A13E] mb-2">
                  {currentStats['heart rate']} <span className="text-2xl">BPM</span>
                </div>
                <p className="text-gray-600 mb-4">current heart rate</p>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="w-full bg-gray-300 rounded-full h-4 mb-2">
                    <div 
                      className="bg-[#F8A13E] h-4 rounded-full"
                      style={{ width: `${Math.min(100, (currentStats['heart rate'] / 180) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-700">
                    {currentStats['heart rate'] < 60 ? 'Resting heart rate - You are relaxed' : 
                     currentStats['heart rate'] < 100 ? 'Normal heart rate - Light activity' : 
                     currentStats['heart rate'] < 140 ? 'Active heart rate - Moderate exercise' : 'High-intensity heart rate - Intense workout'}
                  </p>
                </div>
              </div>
            )}
            <button
              onClick={() => setShowHeartRateModal(false)}
              className="mt-6 w-full py-2 bg-gray-300 text-gray-800 rounded-full font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FitnessPlanner;