import React, { useState, useEffect } from "react";
import "../App.css";
import { ChevronLeftIcon, Edit, Trash2, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import Sidebar from "./Sidebar";
import Background from "./Background";
import MobileHeader from "./MobileHeader";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserGoals } from "../goalAPI";
import API_BASE_URL from "../lib/api"; // Import API_BASE_URL
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const GoalDescription = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // goal_id from URL
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [goalData, setGoalData] = useState(null);
  const [goalProgress, setGoalProgress] = useState(0); // Added state for progress
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [aiSummary, setAiSummary] = useState(null); // Added state for AI recommendation data
  const [error, setError] = useState(null); // Add error state
  
  const handleBlockedAction = () => setShowModal(true);

  // Modified fetchGoalSummary function with improved error handling
  const fetchGoalSummary = async (goalId) => {
    try {
      console.log("Fetching goal summary for:", goalId);
      
      const response = await fetch(`${API_BASE_URL}/api/goals/summary/${goalId}`, {
        credentials: "include",
        headers: {
          "Accept": "application/json"
        }
      });
      
      if (!response.ok) {
        console.error("API error:", response.status, response.statusText);
        throw new Error(`Failed to fetch goal summary: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Summary data received:", data);
      
      // Default response structure to ensure all expected properties exist
      const defaultResponse = {
        goal_marks: [],
        ai_recommendations: [],
        goal_description: "",
        progress_logs: [],
        time_frame: {
          start_date: "",
          end_date: "",
          days_remaining: 0
        },
        goal_completion: {
          percentage: 0,
          current_val: 0,
          target_val: 0,
          progress_summary: ""
        }
      };
      
      // If we have valid data, merge it with defaults to ensure all properties exist
      if (data && data.gemini_response) {
        return {
          ...data,
          gemini_response: {
            ...defaultResponse,
            ...data.gemini_response
          }
        };
      } else {
        console.error("Invalid response format:", data);
        return {
          source: "error",
          gemini_response: defaultResponse
        };
      }
    } catch (error) {
      console.error("Error fetching goal summary:", error);
      // Return default structure on error
      return {
        source: "error",
        gemini_response: {
          goal_marks: [],
          ai_recommendations: [],
          goal_description: "Unable to load goal description at this time.",
          progress_logs: [],
          time_frame: {
            start_date: "",
            end_date: "",
            days_remaining: 0
          },
          goal_completion: {
            percentage: 0,
            current_val: 0,
            target_val: 0,
            progress_summary: ""
          }
        }
      };
    }
  };

  useEffect(() => {
    const loadGoal = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { goals } = await fetchUserGoals();
        const found = goals.find((g) => g.goal_id === id);
        setGoalData(found);
        
        // Now fetch the progress using the same API as FitnessPlanner.js
        if (found) {
          await fetchGoalProgress(found.goal_id);
        } else {
          setError("Goal not found");
        }
      } catch (error) {
        console.error("Failed to load goal data:", error);
        setError("Failed to load goal data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadGoal();
  }, [id]);

  // Add this to load the goal summary
  useEffect(() => {
    const loadGoalSummary = async () => {
      if (id) {
        try {
          const summaryData = await fetchGoalSummary(id);
          if (summaryData && summaryData.gemini_response) {
            setAiSummary(summaryData.gemini_response);
          }
        } catch (error) {
          console.error("Error loading goal summary:", error);
          // Don't set error state here to avoid overriding main error message
        }
      }
    };
    loadGoalSummary();
  }, [id]);

  // New function to fetch goal progress from API
  const fetchGoalProgress = async (goalId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/goals/progress?goal_id=${goalId}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch goal progress: ${response.status}`);
      }
      
      const progressData = await response.json();
      setGoalProgress(progressData?.summary?.overall_progress || 0);
    } catch (error) {
      console.error("Error fetching goal progress:", error);
      // If API call fails, fall back to calculating progress from metrics
      calculateProgressFromMetrics();
    }
  };

  // Fallback function to calculate progress from metrics if API fails
  const calculateProgressFromMetrics = () => {
    if (!goalData || !goalData.metrics) return;
    
    const percentages = goalData.metrics.map(m => {
      const cur = parseFloat(m.current);
      const tar = parseFloat(m.target);
      if (isNaN(cur) || isNaN(tar) || tar === 0) return 0;
      return Math.min((cur / tar) * 100, 100);
    });
    
    if (percentages.length === 0) return;
    
    const avg = percentages.reduce((a, b) => a + b, 0) / percentages.length;
    setGoalProgress(Math.round(avg));
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const sidebarWidth = isMobile ? 0 : 256;

  // Replaced the progress calculation with the state value
  const getProgress = () => goalProgress;

  const calculateDeadline = () => {
    if (!goalData?.start_date || !goalData?.end_date) return "N/A";
    const start = new Date(goalData.start_date);
    const end = new Date(goalData.end_date);
    const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
    return isNaN(diff) ? "N/A" : `${diff} days`;
  };

  return (
    <div className="min-h-screen font-ubuntu flex relative">
      <Background sidebarWidth={sidebarWidth} />
      {isMobile && <MobileHeader toggleSidebar={toggleSidebar} />}
      <Sidebar show={showSidebar} handleClose={() => setShowSidebar(false)} />

      <div
        className={`flex-1 overflow-auto relative z-10 px-3 px-md-4 ${isMobile ? 'mobile-adjusted-content' : ''}`}
        style={{
          marginLeft: isMobile ? '0' : `${sidebarWidth}px`,
          marginTop: '64px',
          paddingBottom: '32px',
          transition: 'margin-left 0.3s ease-in-out',
          backgroundColor: '#0A1A33'
        }}
      >
        <header className="pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white" onClick={() => navigate(-1)}>
              <ChevronLeftIcon className="h-6 w-6" />
            </Button>
            <h2 className="text-xl font-medium text-gray-300">
              My Goals / <span className="text-white">Goal Description</span>
            </h2>
          </div>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-white p-6">
            <p>{error}</p>
          </div>
        ) : goalData ? (
          <div className="p-2 p-md-4">
            <div className="bg-white rounded-lg overflow-hidden">
              <h3 className="font-bold px-4 pt-3">Goal Summary</h3>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead style={{ backgroundColor: '#f8f9fa' }}>
                    <tr>
                      <th className="py-3 ps-4">S.No.</th>
                      <th className="py-3">Type of Goal</th>
                      <th className="py-3">Current Value</th>
                      <th className="py-3">Target Value</th>
                      <th className="py-3">Deadline</th>
                      <th className="py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3 ps-4">1</td>
                      <td className="py-3 text-primary">{goalData.goal_name}</td>
                      <td className="py-3">
                        {goalData.metrics?.map((m, idx) => (
                          <div key={idx}>{m.metric_name}: {m.current}</div>
                        ))}
                      </td>
                      <td className="py-3">
                        {goalData.metrics?.map((m, idx) => (
                          <div key={idx}>{m.metric_name}: {m.target}</div>
                        ))}
                      </td>
                      <td className="py-3">{calculateDeadline()}</td>
                      <td className="py-3">
                        <div className="d-flex justify-content-center gap-2">
                          <button className="btn btn-light btn-sm p-1" style={{ width: '32px', height: '32px' }} onClick={handleBlockedAction}>
                            <Edit size={16} />
                          </button>
                          <button className="btn btn-light btn-sm p-1 text-danger" style={{ width: '32px', height: '32px' }} onClick={handleBlockedAction}>
                            <Trash2 size={16} />
                          </button>
                          <button className="btn btn-light btn-sm p-1" style={{ width: '32px', height: '32px' }}>
                            <Info size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="px-4 pb-4">
                <div className="mt-3 mb-2 d-flex justify-content-between">
                  <span>Progress</span>
                  <span className="font-bold">{getProgress()}%</span>
                </div>
                <Progress value={getProgress()} className="h-4 bg-gray-300" indicatorClassName="bg-[#F9A03F]" />
              </div>
            </div>
            {/* Goal Details Grid - Responsive layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Goal Marks */}
              <div>
                <h3 className="text-xl font-medium mb-2 text-white">Goal Marks</h3>
                <div className="rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-br from-[#F9A03F] via-[#3CAEA3] to-[#20639B] p-4 p-md-6 h-full">
                    {aiSummary ? (
                      <div className="text-white">
                        <h4 className="font-bold mb-2">Key Milestones:</h4>
                        <ul className="list-disc pl-5">
                          {aiSummary.goal_marks && aiSummary.goal_marks.length > 0 ? (
                            aiSummary.goal_marks.map((mark, index) => (
                              <li key={index}>{mark}</li>
                            ))
                          ) : (
                            <li>No milestones available yet</li>
                          )}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-white">Loading goal milestones...</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Specific Goal AI Recommendation */}
              <div>
                <h3 className="text-xl font-medium mb-2 text-white">Specific Goal AI Recommendation</h3>
                <div className="rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-br from-[#F9A03F] via-[#3CAEA3] to-[#20639B] p-4 p-md-6 h-full">
                    {aiSummary ? (
                      <div className="text-white">
                        <ul className="space-y-2">
                          {aiSummary.ai_recommendations && aiSummary.ai_recommendations.length > 0 ? (
                            aiSummary.ai_recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start">
                                <span className="inline-block bg-white text-[#20639B] rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                                  {index + 1}
                                </span>
                                <span>{rec}</span>
                              </li>
                            ))
                          ) : (
                            <li>No recommendations available yet</li>
                          )}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-white">Loading AI recommendations...</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Goal Description */}
              <div>
                <h3 className="text-xl font-medium mb-2 text-white">Goal Description</h3>
                <div className="rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-br from-[#F9A03F] via-[#3CAEA3] to-[#20639B] p-4 p-md-6 h-full">
                    {aiSummary ? (
                      <p className="text-white">{aiSummary.goal_description || "No description available"}</p>
                    ) : (
                      <p className="text-white">Loading goal description...</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Log Progress */}
              <div>
                <h3 className="text-xl font-medium mb-2 text-white">Log Progress</h3>
                <div className="rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-br from-[#F9A03F] via-[#3CAEA3] to-[#20639B] p-4 p-md-6 h-full">
                    {aiSummary && aiSummary.progress_logs && aiSummary.progress_logs.length > 0 ? (
                      <div className="text-white">
                        <h4 className="font-bold mb-3">Recent Progress:</h4>
                        <div className="space-y-2">
                          {aiSummary.progress_logs.map((log, index) => (
                            <div key={index} className="flex justify-between border-b border-white/30 pb-2">
                              <span>{log.date}</span>
                              <span className="font-medium">{log.value}</span>
                            </div>
                          ))}
                        </div>
                        <button className="mt-4 bg-white text-[#20639B] px-4 py-2 rounded-md font-medium hover:bg-opacity-90 transition-all">
                          Log New Progress
                        </button>
                      </div>
                    ) : (
                      <div className="text-white">
                        <p className="mb-3">No progress has been logged yet.</p>
                        <button className="bg-white text-[#20639B] px-4 py-2 rounded-md font-medium hover:bg-opacity-90 transition-all">
                          Start Logging Progress
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Time Frame */}
              <div>
                <h3 className="text-xl font-medium mb-2 text-white">Time Frame</h3>
                <div className="rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-br from-[#F9A03F] via-[#3CAEA3] to-[#20639B] p-4 p-md-6 h-full">
                    {aiSummary && aiSummary.time_frame ? (
                      <div className="text-white">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-white/70">Start Date</p>
                            <p className="font-bold">{aiSummary.time_frame.start_date || "Not set"}</p>
                          </div>
                          <div>
                            <p className="text-white/70">End Date</p>
                            <p className="font-bold">{aiSummary.time_frame.end_date || "Not set"}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-white/70">Days Remaining</p>
                          <div className="flex items-center mt-1">
                            {aiSummary.time_frame.start_date && aiSummary.time_frame.end_date ? (
                              <>
                                <div className="w-full bg-white/30 h-2 rounded-full">
                                  <div 
                                    className="bg-white h-2 rounded-full" 
                                    style={{ 
                                      width: `${100 - (aiSummary.time_frame.days_remaining / 
                                        ((new Date(aiSummary.time_frame.end_date) - new Date(aiSummary.time_frame.start_date)) / 
                                        (1000 * 60 * 60 * 24)) * 100)}%` 
                                    }}
                                  ></div>
                                </div>
                                <span className="ml-3 font-bold">{aiSummary.time_frame.days_remaining}</span>
                              </>
                            ) : (
                              <span>Date information not available</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-white">Loading time frame information...</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Specific Goal Completion */}
              <div>
                <h3 className="text-xl font-medium mb-2 text-white">Specific Goal Completion</h3>
                <div className="rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-br from-[#F9A03F] via-[#3CAEA3] to-[#20639B] p-4 p-md-6 h-full">
                    {aiSummary && aiSummary.goal_completion ? (
                      <div className="text-white flex flex-col items-center">
                        <div className="w-32 h-32 mb-4">
                          <CircularProgressbar
                            value={aiSummary.goal_completion.percentage || 0}
                            text={`${aiSummary.goal_completion.percentage || 0}%`}
                            styles={buildStyles({
                              textColor: 'white',
                              pathColor: 'white',
                              trailColor: 'rgba(255, 255, 255, 0.3)',
                            })}
                          />
                        </div>
                        <div className="text-center">
                          <div className="flex justify-between w-full mb-1">
                            <span>Current: {aiSummary.goal_completion.current_val || 0}</span>
                            <span>Target: {aiSummary.goal_completion.target_val || 0}</span>
                          </div>
                          <p className="mt-3">{aiSummary.goal_completion.progress_summary || "No progress summary available"}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-white">Loading goal completion data...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-white p-6">
            <p>Goal not found.</p>
          </div>
        )}
      </div>
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-2"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-xl font-semibold mb-2 text-dark">Action Not Allowed</h4>
            <p className="text-gray-700 mb-4">
              You can't edit or delete goals here. Please go to <strong>My Goals</strong> to manage your goals.
            </p>
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="rounded-pill"
              >
                Close
              </Button>
              <Button
                onClick={() => navigate("/goals")}
                className="bg-blue-600 text-white rounded-pill hover:bg-blue-700"
              >
                Go to My Goals
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalDescription;