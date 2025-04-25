import React, { useState, useEffect } from "react";
import "../App.css";
import { ChevronLeftIcon, Edit, Trash2, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import Sidebar from "./Sidebar";
import Background from "./Background";
import MobileHeader from "./MobileHeader";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserGoals, fetchGoalTypes } from "../goalAPI";
import API_BASE_URL from "../lib/api";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const GoalDescription = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [goalData, setGoalData] = useState(null);
  const [goalProgress, setGoalProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState(null);
  const [error, setError] = useState(null);
  
  // Add these states for the log progress modal
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [goalTypes, setGoalTypes] = useState([]);
  const [selectedGoalType, setSelectedGoalType] = useState("");
  const [metricName, setMetricName] = useState("");
  const [metricValue, setMetricValue] = useState("");
  const [progressLogs, setProgressLogs] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); // Used to trigger useEffect refresh
  const [infoGoalId, setInfoGoalId] = useState(null);

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
  }, [id, refreshKey]); // Added refreshKey dependency to reload data after progress is logged

  // Load goal types for dropdown
  useEffect(() => {
    const loadGoalTypes = async () => {
      try {
        const types = await fetchGoalTypes();
        setGoalTypes(types);
      } catch (error) {
        console.error("Failed to load goal types:", error);
      }
    };
    loadGoalTypes();
  }, []);

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
  }, [id, refreshKey]); // Added refreshKey dependency

  // Function to fetch goal progress from API
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
      
      // Store progress logs for display in the UI
      if (progressData?.progress && progressData.progress.length > 0) {
        const formattedLogs = progressData.progress.map(log => ({
          id: log.progress_id,
          date: new Date(log.created_at).toLocaleDateString(),
          metrics: log.metrics
        }));
        setProgressLogs(formattedLogs);
      }
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

  // Function to handle log progress submission
  const handleLogProgress = async () => {
    try {
      // Find the selected metric
      const selectedGoalTypeObj = goalTypes.find((g) => g.goal_type_id === selectedGoalType);
      const metric = selectedGoalTypeObj?.metrics.find(m => m.metric_name === metricName);

      if (!metric || !metric.metric_id || !goalData?.goal_id) {
        alert("Invalid input. Please ensure all fields are filled correctly.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/goals/progress`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal_id: goalData.goal_id,
          metrics: [{ metric_id: metric.metric_id, metric_val: Number(metricValue) }]
        })
      });

      if (!res.ok) {
        throw new Error("Failed to log progress");
      }

      const data = await res.json();
      console.log("Progress logged successfully:", data);
      
      // Reset form fields
      setSelectedGoalType("");
      setMetricName("");
      setMetricValue("");
      setLogModalOpen(false);
      
      // Trigger refresh of goal data
      setRefreshKey(prev => prev + 1);
      
      // Show success notification (you could add a toast notification system here)
      alert("Progress logged successfully!");
    } catch (error) {
      console.error("Error logging progress:", error);
      alert("Failed to log progress. Please try again.");
    }
  };

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const sidebarWidth = isMobile ? 0 : 256;

  // Get available metrics based on selected goal type
  const getAvailableMetrics = () => {
    const selectedGoalTypeObj = goalTypes.find(g => g.goal_type_id === selectedGoalType);
    return selectedGoalTypeObj?.metrics || [];
  };

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
                          <div 
  className="position-relative"
  onMouseEnter={() => setInfoGoalId(goalData.goal_id)}
  onMouseLeave={() => setInfoGoalId(null)}
>
  <Button
    variant="light"
    size="sm"
    className="p-1 d-flex align-items-center justify-content-center"
    style={{ width: '32px', height: '32px' }}
  >
    <Info size={16} />
  </Button>

  {infoGoalId === goalData.goal_id && (
    <div 
      className="position-absolute bg-white shadow rounded p-2 small text-start"
      style={{ bottom: '10px', right: '0', zIndex: 1000, width: '220px' }}
    >
      <strong>Start Date:</strong> {goalData.start_date?.split("T")[0] || "N/A"}<br />
      <em className="text-muted">Check below for AI recommendations and log your progress.</em>
    </div>
  )}
</div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="px-4 pb-4">
                <div className="mt-3 mb-2 d-flex justify-content-between">
                  <span>Progress</span>
                  <span className="font-bold">{goalProgress}%</span>
                </div>
                <Progress value={goalProgress} className="h-4 bg-gray-300" indicatorClassName="bg-[#F9A03F]" />
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
                    {progressLogs && progressLogs.length > 0 ? (
                      <div className="text-white">
                        <h4 className="font-bold mb-3">Recent Progress:</h4>
                        <div className="space-y-2">
                          {progressLogs.slice(0, 3).map((log, index) => (
                            <div key={index} className="flex justify-between border-b border-white/30 pb-2">
                              <span>{log.date}</span>
                              <div>
                                {log.metrics.map((metric, idx) => (
                                  <div key={idx} className="text-right">
                                    <span className="font-medium">{metric.metric_name}: {metric.value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <button 
                          className="mt-4 bg-white text-[#20639B] px-4 py-2 rounded-md font-medium hover:bg-opacity-90 transition-all"
                          onClick={() => setLogModalOpen(true)}
                        >
                          Log New Progress
                        </button>
                      </div>
                    ) : (
                      <div className="text-white">
                        <p className="mb-3">No progress has been logged yet.</p>
                        <button 
                          className="bg-white text-[#20639B] px-4 py-2 rounded-md font-medium hover:bg-opacity-90 transition-all"
                          onClick={() => setLogModalOpen(true)}
                        >
                          Start Logging Progress
                        </button>
                      </div>
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

      {/* Log Progress Modal */}
      {logModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4 text-center">Log Progress</h3>

            <label className="block text-sm font-medium mb-1">Type of Goal</label>
            <select
              className="w-full border px-3 py-2 rounded mb-4"
              value={selectedGoalType}
              onChange={(e) => setSelectedGoalType(e.target.value)}
            >
              <option value="">Select goal type</option>
              {goalTypes.map((type) => (
                <option key={type.goal_type_id} value={type.goal_type_id}>{type.goal_name}</option>
              ))}
            </select>

            <label className="block text-sm font-medium mb-1">Metric Name</label>
            <select
              className="w-full border px-3 py-2 rounded mb-4"
              value={metricName}
              onChange={(e) => setMetricName(e.target.value)}
              disabled={!selectedGoalType}
            >
              <option value="">Select metric</option>
              {getAvailableMetrics().map((metric) => (
                <option key={metric.metric_id} value={metric.metric_name}>{metric.metric_name}</option>
              ))}
            </select>

            <label className="block text-sm font-medium mb-1">Metric Value</label>
            <input
              className="w-full border px-3 py-2 rounded mb-6"
              type="number"
              placeholder="Enter value"
              value={metricValue}
              onChange={(e) => setMetricValue(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setLogModalOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 text-white" onClick={handleLogProgress}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Action Not Allowed Modal */}
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