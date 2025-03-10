import React, { useState, useEffect } from "react";
import Background from "./Background";
import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";
import { Edit, Trash2, Info } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

const MyGoalsPage = () => {
  const sidebarWidth = 256;
  const navigate = useNavigate();
  const location = useLocation();
  const [previousPage, setPreviousPage] = useState("/");
  const [showDetails, setShowDetails] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [goals, setGoals] = useState([
    {
      type: "Lose Weight",
      currentValue: "180 lbs",
      target: "160 lbs",
      startDate: "2024-02-01",
      endDate: "2024-06-01",
      
    },
    {
      type: "Running",
      currentValue: "2 Miles",
      target: "5 Miles",
      startDate: "2024-03-01",
      endDate: "2024-05-01",
     
    }
  ]);

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
    // Add the new goal to the goals array
    setGoals([...goals, { ...goal }]);
    // Close the popup
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
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-center text-white mb-4">Add/Edit Goal</h2>
              
              <form onSubmit={handleAddGoal}>
                {/* Type of Goal */}
                <div className="mb-3">
                  <label className="form-label text-white">Type of Goal</label>
                  <input
                    className="form-control"
                    type="text"
                    name="type"
                    value={goal.type}
                    onChange={handleChange}
                    placeholder="Choose a goal"
                    required
                  />
                </div>

                {/* Current Value Input */}
                {/*<div className="mb-3">
                  <label className="form-label text-white">Current Value</label>
                  <input
                    className="form-control"
                    type="text"
                    name="currentValue"
                    value={goal.currentValue}
                    onChange={handleChange}
                    placeholder="Enter current value"
                    required
                  />
                </div>*/}

                {/* Target Value Input */}
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

                {/* Start Date */}
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

                {/* End Date */}
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

                

                {/* Buttons */}
                <div className="d-grid gap-2">
                  <Button 
                    type="submit" 
                    className="btn rounded-pill"
                    style={{
                      backgroundColor: '#F8A13E',
                      border: 'none'
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
        )}
      </Container>
    </div>
  );
};

export default MyGoalsPage;