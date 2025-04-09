import React, { useState, useEffect } from "react";
import Background from "./Background";
import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";
import { Edit, Trash2, Info } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

// API INTEGRATION -----------------------------------------------------------
// Fetch user goals from the backend
async function fetchUserGoals(sessionToken) {
  try {
    const response = await fetch('http://localhost:3000/api/goals', {
      method: 'GET',
      headers: {
        'Cookie': `next-auth.session-token=${sessionToken}`
      },
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Failed to fetch user goals');

    const data = await response.json();
    console.log('User Goals:', data);
    return data;
  } catch (error) {
    console.error('Error fetching user goals:', error);
    return [];
  }
}

// Fetch goal types from the backend
async function fetchGoalTypes(sessionToken) {
  try {
    const response = await fetch('http://localhost:3000/api/goals/config', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `next-auth.session-token=${sessionToken}`,
      },
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to fetch goal types');

    const data = await response.json();
    console.log('Goal Types:', data.goals);
    return data.goals;
  } catch (error) {
    console.error('Error fetching goal types:', error);
    return [];
  }
}

// Create a new goal in the backend
async function createGoal(sessionToken, goalData) {
  try {
    const response = await fetch('http://localhost:3000/api/goals/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `next-auth.session-token=${sessionToken}`
      },
      credentials: 'include',
      body: JSON.stringify(goalData)
    });

    if (!response.ok) throw new Error('Failed to create goal');

    const data = await response.json();
    console.log('Created Goal:', data);
    return data;
  } catch (error) {
    console.error('Error creating goal:', error);
  }
}

// ----------------------------------------------------------------------------

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

  // Handle goal type selection
  const handleGoalTypeChange = (e) => {
    const selectedGoalId = e.target.value;
    const selectedGoal = goalTypes.find((goal) => goal.goal_type_id === selectedGoalId);

    setSelectedGoalType(selectedGoalId);
    setSelectedMetrics(selectedGoal ? selectedGoal.metrics : []);
  };

  // Handle metric input changes
  const handleMetricInputChange = (metric, value) => {
    setMetricInputs((prev) => ({
      ...prev,
      [metric]: value,
    }));
  };

  // Fetch user goals when the page loads
  useEffect(() => {
    const sessionToken = "your-session-token"; // Replace with the actual user session token
    const loadGoals = async () => {
      const fetchedGoals = await fetchUserGoals(sessionToken);
      setGoals(fetchedGoals);
    };

    loadGoals();
  }, []);

  // Fetch goal types when the page loads
  useEffect(() => {
    const sessionToken = "your-session-token"; // Replace with the actual session token
    const loadGoalTypes = async () => {
      const fetchedGoalTypes = await fetchGoalTypes(sessionToken);
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
    type: "",
    currentValue: "",
    target: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    setGoal({ ...goal, [e.target.name]: e.target.value });
  };

  const handleOpenPopup = () => setShowPopup(true);
  const handleClosePopup = () => {
    setShowPopup(false);
    // Reset form
    setGoal({
      type: "",
      currentValue: "",
      target: "",
      startDate: "",
      endDate: "",
    });
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    const sessionToken = "your-session-token"; // Replace with actual session token

    const newGoal = {
      type: selectedGoalType,
      metrics: Object.entries(metricInputs).map(([metric, value]) => ({
        metric_name: metric,
        value,
      })),
      target: goal.target,
      startDate: goal.startDate,
      endDate: goal.endDate,
    };

    setGoals([...goals, newGoal]);
    handleClosePopup();
  };

  const handleDeleteGoal = (index) => {
    const updatedGoals = [...goals];
    updatedGoals.splice(index, 1);
    setGoals(updatedGoals);
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
                      {goals.map((goalItem, index) => {
                        // Calculate deadline in days
                        const startDate = new Date(goalItem.startDate);
                        const endDate = new Date(goalItem.endDate);
                        const deadlineDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
                        
                        return (
                          <tr key={index}>
                            <td className="py-3 ps-4">{index + 1}</td>
                            <td className="py-3">
                              <a
                                href="#"
                                className="text-decoration-none"
                                style={{ color: '#007bff' }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate(`/goals/${index + 1}`, {
                                    state: { goal: goalItem }
                                  });
                                }}
                              >
                                {goalItem.type}
                              </a>
                            </td>
                            <td className="py-3">{goalItem.currentValue}</td>
                            <td className="py-3">{goalItem.target}</td>
                            <td className="py-3">
                              {deadlineDays} days
                            </td>
                            <td className="py-3">
                              <div className="d-flex justify-content-center gap-2">
                                <Button 
                                  variant="light"
                                  size="sm"
                                  className="p-1 d-flex align-items-center justify-content-center"
                                  style={{ width: '32px', height: '32px' }}
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button 
                                  variant="light"
                                  size="sm"
                                  className="p-1 d-flex align-items-center justify-content-center text-danger"
                                  style={{ width: '32px', height: '32px' }}
                                  onClick={() => handleDeleteGoal(index)}
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
                      })}
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
                <form onSubmit={handleAddGoal}>
                  {/* Goal Type Dropdown */}
                  <div className="mb-3">
                    <label className="form-label text-white">Type of Goal</label>
                    <select
                      className="form-control"
                      name="type"
                      value={selectedGoalType}
                      onChange={handleGoalTypeChange}
                      required
                    >
                      <option value="" disabled>
                        Select a goal type
                      </option>
                      {goalTypes.map((goal) => (
                        <option key={goal.goal_type_id} value={goal.goal_type_id}>
                          {goal.goal_name}
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
                            <input
                              type={metric.metric_type === "int" ? "number" : "text"}
                              className="form-control"
                              placeholder={`Enter value for ${metric.metric_name}`}
                              value={metricInputs[metric.metric_name] || ""}
                              onChange={(e) => handleMetricInputChange(metric.metric_name, e.target.value)}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Other Inputs */}
                  <div className="mb-3">
                    <label className="form-label text-white">Target Value</label>
                    <input
                      className="form-control"
                      type="text"
                      name="target"
                      value={goal.target}
                      onChange={handleChange}
                      placeholder="Enter target value"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-white">Start Date</label>
                    <input
                      className="form-control"
                      type="date"
                      name="startDate"
                      value={goal.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-white">End Date</label>
                    <input
                      className="form-control"
                      type="date"
                      name="endDate"
                      value={goal.endDate}
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
                      + Add
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