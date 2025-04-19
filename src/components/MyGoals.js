import React, { useState, useEffect } from "react";
import Background from "./Background";
import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";
import { Edit, Trash2, Info } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import GoalDescription from "./GoalsDescription.js";
import { Link } from 'react-router-dom';
import { fetchUserGoals, fetchGoalTypes, createGoal, updateGoal, deleteGoal } from "../goalAPI.js"; // Import API functions
//import { type } from "@testing-library/user-event/dist/type/index.js";

// MyGoalsPage Component
const MyGoalsPage = () => {
  const sidebarWidth = 256;
  const navigate = useNavigate();
  const location = useLocation();
  const [previousPage, setPreviousPage] = useState("/");
  const [showDetails, setShowDetails] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [goals, setGoals] = useState([]);
  const [selectedGoalType, setSelectedGoalType] = useState("");
  const [metrics, setMetrics] = useState([]);
  const [metricInputs, setMetricInputs] = useState({});
  const [goalTypes, setGoalTypes] = useState([]); // Stores goal types from the API
  const [selectedMetrics, setSelectedMetrics] = useState([]); // Stores metrics for the selected goal
  const [isEditing, setIsEditing] = useState(false);
  const [editGoalId, setEditGoalId] = useState(null);
  const [loading, setLoading] = useState(true);


  
  // Handle goal type selection
  const handleGoalTypeChange = (e) => {
    const selectedGoalId = e.target.value;
    const selectedGoal = goalTypes.find((goal) => goal.goal_type_id === selectedGoalId);

    setSelectedGoalType(selectedGoalId); // Store the goal_type_id
    setSelectedMetrics(selectedGoal ? selectedGoal.metrics : []); // Update the metrics for the selected goal

    // Update the goal_name in the goal state
    setGoal((prevGoal) => ({
      ...prevGoal,
      goal_name: selectedGoal ? selectedGoal.goal_name : "", // Set the goal_name
    }));
  };

  // Handle metric input changes
  const handleMetricInputChange = (metricName, field, value) => {
    setMetricInputs((prev) => ({
      ...prev,
      [metricName]: {
        ...prev[metricName],
        [field]: value, // Update either "current" or "target" field
      },
    }));
  };

  // Fetch user goals when the page loads
  useEffect(() => { 
    const loadGoals = async () => {
      setLoading(true); 

      const fetchedGoals = await fetchUserGoals();
      console.log("Fetched Goals:", fetchedGoals);
      if (!fetchedGoals.goals || fetchedGoals.goals.length === 0) {
        console.log("No goals found or failed to fetch goals");
        return;
      }


      const fetchedGoalTypes = await fetchGoalTypes();
      for(let goal of fetchedGoals.goals) {
        const goalType = fetchedGoalTypes.find(type => type.goal_name === goal.goal_name);
        console.log("Goal Type:", goalType); // Log each goal type for debugging

        if (goalType) {

          for(let metric of goal.metrics) {
            const metricType = goalType.metrics.find(m => m.metric_name === metric.metric_name);
            console.log("Metric Type:", metricType); // Log each metric type for debugging


            if (metricType) {
              metric.metric_id = metricType.metric_id; // Set the metric type
            }
          }
        }
      }


      setGoals(fetchedGoals.goals);
      setLoading(false); 
    };

    loadGoals();
  }, []);

  // Fetch goal types when the page loads
  useEffect(() => { 
    const loadGoalTypes = async () => {
      const fetchedGoalTypes = await fetchGoalTypes();
      setGoalTypes(fetchedGoalTypes);
    };

    loadGoalTypes();
  }, []);

  // Get the previous page from location state or default to dashboard
  useEffect(() => {
    if (location.state && location.state.from) {
      setPreviousPage(location.state.from);
    }
  }, [location]);

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleBack = () => {
    navigate(previousPage);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const [showPopup, setShowPopup] = useState(false);
  const [goal, setGoal] = useState({
    goal_name: "", // The name of the goal
    metrics: [], // Array of metrics (e.g., current and target values)
    start_date: "", // Start date of the goal
    end_date: "", // End date of the goal
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoal((prevGoal) => ({
      ...prevGoal,
      [name]: value, // Dynamically update the field based on the input's name
    }));
  };

  const handleOpenPopup = (goal = null) => {
    if (goal && typeof goal === "object") {
      // Edit existing goal
      setIsEditing(true);
      setEditGoalId(goal.goal_id);
  
      const safeStartDate = goal.start_date?.split("T")[0] || "";
      const safeEndDate = goal.end_date?.split("T")[0] || "";
  
      setGoal({
        goal_name: goal.goal_name || "",
        metrics: goal.metrics || [],
        start_date: safeStartDate,
        end_date: safeEndDate,
      });
  
      const prefilled = {};
      (goal.metrics || []).forEach(metric => {
        prefilled[metric.metric_name] = {
          current: metric.current || "",
          target: metric.target || "",
        };
      });
      setMetricInputs(prefilled);
  
      const selected = goalTypes.find(g => g.goal_name === goal.goal_name);
      if (selected) {
        setSelectedGoalType(selected.goal_type_id);
        setSelectedMetrics(selected.metrics || []);
      } else {
        setSelectedGoalType("");
        setSelectedMetrics([]);
      }
  
    } else {
      // Add new goal
      setIsEditing(false);
      setEditGoalId(null);
  
      setGoal({
        goal_name: "",
        metrics: [],
        start_date: "",
        end_date: "",
      });
  
      setMetricInputs({});
      setSelectedGoalType("");      // <- allow user to choose freely
      setSelectedMetrics([]);       // <- will get updated after goal type is selected
    }
  
    setShowPopup(true);
  };  
  

  const handleClosePopup = () => {
    setShowPopup(false);
    // Reset form
    setGoal({
      goal_name: "",
      metrics: [],
      start_date: "",
      end_date: "",
    });
    setMetricInputs({}); // Reset metric inputs
  };

  const handleSaveGoal = async (e) => {
    e.preventDefault();
  
    const metricsArray = selectedMetrics.map((metric) => ({
      metric_id: metric.metric_id, 
      metrics_name: metric.metric_name,
      current: metricInputs[metric.metric_name]?.current || "",
      target: metricInputs[metric.metric_name]?.target || "",
    }));
  
    const goalData = {
      goal_name: goal.goal_name, // Cannot be edited, just included
      metrics: metricsArray,
      start_date: goal.start_date,
      end_date: goal.end_date,
      current_date: new Date().toISOString().split("T")[0],
    };
  
    try {
      let result;
      if (isEditing && editGoalId) {
        result = await updateGoal(editGoalId, goalData);
        console.log("Updated Goal:", result);
      } else {
        result = await createGoal(goalData);
        console.log("Created Goal:", result);
      }
  
      if (result) {
        const refreshedGoals = await fetchUserGoals();
        setGoals(refreshedGoals.goals || []);
        handleClosePopup();
      }      
    } catch (error) {
      console.error("Error saving goal:", error);
    }
  };
  

  const handleDeleteGoal = async (goalId) => {
    const confirmed = window.confirm("Are you sure you want to delete this goal?");
    if (!confirmed) return;
  
    try {
      const result = await deleteGoal(goalId);
      if (result?.message) {
        console.log(result.message);
        setGoals(prev => prev.filter(g => g.goal_id !== goalId));
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };
  

  return (
    <div className="min-h-screen font-ubuntu flex relative">
      {/* Background Component */}
      <Background sidebarWidth={sidebarWidth} />
      
      {/* Mobile Header - Only visible on mobile */}
      {isMobile && <MobileHeader toggleSidebar={toggleSidebar} />}
      
      {/* Sidebar Component */}
      <Sidebar show={showSidebar} handleClose={() => setShowSidebar(false)} />

      {/* Scrollable Content Area */}
      <Container 
        fluid 
        className={`overflow-auto relative z-10 px-3 px-md-4 ${isMobile ? 'mobile-adjusted-content' : ''}`}
        style={{ 
          marginLeft: isMobile ? '0' : `${sidebarWidth}px`, 
          marginTop: '64px',
          paddingBottom: '32px',
          transition: 'margin-left 0.3s ease-in-out',
          height: '100vh'
        }}
      >
        <Row className="mb-4 mt-4">
          <Col>
            <h1 className="text-3xl font-bold text-white font-ubuntu">My Goals ({goals.length})</h1>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <Button 
              onClick={handleOpenPopup}
              className="rounded-pill px-4 py-2"
              style={{
                backgroundColor: '#F8A13E',
                border: 'none'
              }}
            >
              + Add Goals
            </Button>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card className="border-0 overflow-hidden h-100" style={{ 
              borderRadius: '1rem', 
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              height: 'calc(100vh - 150px)' // Adjust to fill remaining space
            }}>
              <Card.Body className="p-0">
                <div className="table-responsive" style={{ height: '100%' }}>
                  <table className="table table-hover mb-0">
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                      <tr>
                        <th scope="col" className="py-3 ps-4">S.No.</th>
                        <th scope="col" className="py-3">Type of Goal</th>
                        <th scope="col" className="py-3">Current Value</th>
                        <th scope="col" className="py-3">Target Value</th>
                        <th scope="col" className="py-3">Deadline</th>
                        <th scope="col" className="py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                     {loading ? (
                       <tr>
                         <td colSpan="6" className="text-center py-4">
                         <span className="spinner-border spinner-border-sm me-2"></span>
                          Loading goals...
                         </td>
                       </tr>
                     ) : (
                       goals.map((goalItem, index) => {
                        console.log("Goal Item:", goalItem); // Log each goal item for debugging
                        const startDate = new Date(goalItem.start_date);
                        const endDate = new Date(goalItem.end_date);
                        const deadlineDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));

                        return (
                          <tr key={index}>
                            <td className="py-3 ps-4">{index + 1}</td>
                            <td className="py-3"><Link 
                                 to={`/goals/${goalItem.goal_id}`} 
                                 className="text-decoration-none text-primary fw-semibold"
                                >
                                  {goalItem.goal_name || "N/A"}
                                </Link></td>
                            <td className="py-3">
                              {goalItem.metrics && goalItem.metrics.length > 0
                                ? goalItem.metrics.map((metric) => (
                                    <div key={metric.metrics_name}>
                                      {metric.metrics_name}{metric.metric_name}: {metric.current}
                                    </div>
                                  ))
                                : "N/A"}
                            </td>
                            <td className="py-3">
                              {goalItem.metrics && goalItem.metrics.length > 0
                                ? goalItem.metrics.map((metric) => (
                                    <div key={metric.metrics_name}>
                                      {metric.metrics_name} {metric.target}
                                    </div>
                                  ))
                                : "N/A"}
                            </td>
                            <td className="py-3">{deadlineDays > 0 ? `${deadlineDays} days` : "Deadline passed"}</td>
                            <td className="py-3">
                              <div className="d-flex justify-content-center gap-2">
                                <Button
                                  variant="light"
                                  size="sm"
                                  className="p-1 d-flex align-items-center justify-content-center"
                                  style={{ width: '32px', height: '32px' }}
                                  onClick={() => handleOpenPopup(goalItem)} 
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button
                                  variant="light"
                                  size="sm"
                                  className="p-1 d-flex align-items-center justify-content-center text-danger"
                                  style={{ width: '32px', height: '32px' }}
                                  onClick={() => handleDeleteGoal(goalItem.goal_id)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                                <Button
                                  variant="light"
                                  size="sm"
                                  className="p-1 d-flex align-items-center justify-content-center"
                                  style={{ width: '32px', height: '32px' }}
                                >
                                  <Info size={16} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Add/Edit Goal Modal Popup */}
        {showPopup && (
          <div 
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.5)', 
              zIndex: 1100,
            }}
            onClick={handleClosePopup}
          >
            <div 
              style={{
                maxWidth: '450px',
                width: '100%',
                borderRadius: '1rem',
                background: 'linear-gradient(to bottom, #F8A13E, #6ECAE3, #01B1E3)',
                padding: '1.5rem',
                maxHeight: '90vh', // Limit the height of the modal
                overflow: 'hidden', // Prevent content overflow
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-center text-white mb-4">Add/Edit Goal</h2>
              
              {/* Scrollable Form Container */}
              <div 
                style={{
                  maxHeight: '75vh', // Adjust height for scrollable content
                  overflowY: 'auto', // Enable vertical scrolling
                  scrollbarWidth: 'none', // Hide scrollbar for Firefox
                  msOverflowStyle: 'none', // Hide scrollbar for IE and Edge
                }}
                className="custom-scrollbar"
              >
                <form onSubmit={handleSaveGoal}>
                  {/* Goal Type Dropdown */}
                  <div className="mb-3">
                    <label className="form-label text-white">Type of Goal</label>
                    <select
                      className="form-control"
                      name="goal_name"
                      value={selectedGoalType}
                      onChange={handleGoalTypeChange}
                    
                      required
                    >
                      <option value="" disabled>
                        Select a goal type
                      </option>
                      {goalTypes.map((goalType) => (
                        <option key={goalType.goal_type_id} value={goalType.goal_type_id}>
                          {goalType.goal_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Metrics for the Selected Goal */}
                  {selectedMetrics.length > 0 && (
                    <div className="mb-3">
                      <label className="form-label text-white">Metrics</label>
                      <ul className="list-group">
                        {selectedMetrics.map((metric) => (
                          <li key={metric.metric_id} className="list-group-item">
                            <label className="form-label">{metric.metric_name}</label>
                            {/* Current Value Input */}
                            <input
                              type={metric.metric_type === "int" ? "number" : "text"}
                              className="form-control mb-2"
                              placeholder={`Enter current value for ${metric.metric_name}`}
                              value={metricInputs[metric.metric_name]?.current || ""} // Default to an empty string
                              onChange={(e) =>
                                handleMetricInputChange(metric.metric_name, "current", e.target.value)
                              }
                            />
                            {/* Target Value Input */}
                            <input
                              type={metric.metric_type === "int" ? "number" : "text"}
                              className="form-control"
                              placeholder={`Enter target value for ${metric.metric_name}`}
                              value={metricInputs[metric.metric_name]?.target || ""} // Default to an empty string
                              onChange={(e) =>
                                handleMetricInputChange(metric.metric_name, "target", e.target.value)
                              }
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label text-white">Start Date</label>
                    <input
                      className="form-control"
                      type="date"
                      name="start_date"
                      value={goal.start_date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-white">End Date</label>
                    <input
                      className="form-control"
                      type="date"
                      name="end_date"
                      value={goal.end_date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid gap-2">
                    <Button
                      type="submit"
                      className="btn rounded-pill"
                      style={{
                        backgroundColor: "#F8A13E",
                        border: "none",
                      }}
                    >
                      + Add/Edit 
                    </Button>
                    <Button
                      type="button"
                      variant="outline-light"
                      className="rounded-pill"
                      onClick={handleClosePopup}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};



export default MyGoalsPage;